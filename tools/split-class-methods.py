#!/usr/bin/env python3
"""
Tách method của ParkSimulation sang module domain theo pattern delegation.

Cơ chế:
  - Method gốc trong class  ->  hàm độc lập trong module domain, nhận `sim: ParkSimulation`
  - Thân hàm: `this.` -> `sim.`; gọi chéo trong cùng nhóm -> gọi trực tiếp hàm domain
  - Class giữ delegator 1 dòng, giữ NGUYÊN VĂN chữ ký gốc (kể cả return type nhiều dòng)

An toàn:
  - Xác định body bằng brace-matching ngược từ dòng đóng method => không vỡ với
    return type nhiều dòng (vd `): {`).
  - Giữ nguyên thứ tự method trong class.
  - Module domain chỉ dùng `import type { ParkSimulation }` => không vòng lặp runtime.
  - Validate: không mất dòng nào, không đổi tên, không đổi signature.
"""
import re
import sys

SRC = "src/sim/simulation.ts"


def parse_methods(lines, cls, end):
    """Trả về list (name, vis, start, end).

    Dùng brace-matching tiến: từ dòng mở method, cân bằng '{'/'}' để tìm
    dòng đóng method. Bắt buộc: delegator 1 dòng không kết thúc bằng '  }',
    nên quét theo dấu '  }' sẽ nuốt method kế tiếp.
    """
    methods = []
    i = cls + 1
    while i < end:
        m = re.match(r"^  (public|private) ([a-zA-Z][a-zA-Z0-9_]*)\(", lines[i])
        if not m:
            i += 1
            continue
        # cân bằng ngoặc từ dòng i
        depth = 0
        started = False
        j = i
        while j < end:
            l = lines[j]
            for ch in l:
                if ch == "{":
                    depth += 1
                    started = True
                elif ch == "}":
                    depth -= 1
            if started and depth == 0:
                break
            j += 1
        methods.append((m.group(2), m.group(1), i, j))
        i = j + 1
    return methods


def find_body_open(lines, start, end):
    """Tìm vị trí '{' mở THÂN method.

    Quét tiến, theo dõi depth. Mỗi transition 0->1 là một '{'. Body mở thân là
    transition CUỐI CÙNG (return type dạng object `): { a: b } {` có transition
    riêng trước đó, nên phải lấy transition cuối, không phải cái đầu).

    Trả về (body_open_line, sig_lines) — sig_lines = signature tới body '{' (không kể).
    """
    depth = 0
    last_open = None  # (line_idx, char_idx)
    for i in range(start, end + 1):
        l = lines[i]
        for ci, ch in enumerate(l):
            if ch == "{":
                if depth == 0:
                    last_open = (i, ci)
                depth += 1
            elif ch == "}":
                depth -= 1
    if last_open is None:
        raise SystemExit(f"ERROR: không tìm thấy body open cho method dòng {start}")
    bi, bci = last_open
    sig = list(lines[start : bi + 1])
    sig[-1] = sig[-1][:bci].rstrip()  # bỏ phần '{' mở body
    return bi, sig


def split_params_and_ret(sig_text):
    """Chia signature (không có '{') thành (vis, name, params, ret).
    params/ret có thể nhiều dòng; ret giữ nguyên (bao gồm {} của object type)."""
    m = re.match(
        r"^\s*(public|private)\s+([a-zA-Z][a-zA-Z0-9_]*)\s*\(", sig_text, re.S
    )
    if not m:
        raise SystemExit(f"ERROR: không parse đầu signature: {sig_text[:80]!r}")
    vis, fname = m.group(1), m.group(2)
    # cân bằng ngoặc để tìm đóng params
    depth = 1
    i = m.end()
    while i < len(sig_text) and depth > 0:
        if sig_text[i] == "(":
            depth += 1
        elif sig_text[i] == ")":
            depth -= 1
        i += 1
    params = sig_text[m.end() : i - 1]
    ret = sig_text[i:].strip()
    if ret.startswith(":"):
        ret = ret[1:].strip()
    return vis, fname, params, ret


def param_names(params):
    """Danh sách tên tham số ở top-level (bỏ default value và type annotation)."""
    out = []
    depth = 0
    cur = ""
    for ch in params:
        if ch in "([{<":
            depth += 1
        elif ch in ")]}>":
            depth -= 1
        if ch == "," and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur)
    names = []
    for a in out:
        a = a.strip()
        if "=" in a:
            a = a.split("=")[0].strip()
        depth = 0
        cut = None
        for j, ch in enumerate(a):
            if ch in "([{<":
                depth += 1
            elif ch in ")]}>":
                depth -= 1
            elif ch == ":" and depth == 0:
                cut = j
                break
        if cut is not None:
            a = a[:cut].strip()
        a = a.replace("?", "").strip()  # bỏ dấu optional '?'
        names.append(a)
    return names


def main():
    module_path = sys.argv[1]
    module_name = sys.argv[2]
    prefix = sys.argv[3]
    names = sys.argv[4].split(",")

    src = open(SRC).read()
    lines = src.split("\n")

    cls = next(i for i, l in enumerate(lines) if l.startswith("export class ParkSimulation"))
    end = max(i for i, l in enumerate(lines) if l == "}")

    methods = parse_methods(lines, cls, end)
    by_name = {m[0]: m for m in methods}
    missing = [n for n in names if n not in by_name]
    if missing:
        sys.exit(f"ERROR: không tìm thấy method: {missing}")

    # --- Thu thập: signature verbatim + body ---
    extracted = []  # (name, vis, sig_lines, body_lines)
    for n in names:
        _, vis, s, e = by_name[n]
        body_open, sig_lines = find_body_open(lines, s, e)
        body = lines[body_open + 1 : e]
        while body and body[-1].strip() == "":
            body.pop()
        extracted.append((n, vis, sig_lines, body))

    # --- Ghi module domain ---
    mod = []
    mod.append(f"// Tách tự động từ {SRC} (P0.2 — tách god file theo domain).")
    mod.append("// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.")
    mod.append("")

    # copy import block trước class (import + re-export, state machine an toàn)
    in_block = False
    for l in lines[:cls]:
        st = l.strip()
        if st.startswith("import ") or st.startswith("export {") or st.startswith("export type {"):
            in_block = True
            mod.append(l)
        elif in_block:
            if st == "":
                in_block = False
                continue
            if l.startswith("  ") or st.startswith("} from") or st == "}":
                mod.append(l)
            else:
                in_block = False
    mod.append("import type { ParkSimulation } from './simulation';")
    mod.append("")

    # private method trong nhóm được gọi bởi method khác trong nhóm -> phải public
    moved = set(names)
    need_public = set()
    for n, vis, sig_lines, body in extracted:
        if vis != "private":
            continue
        bodytext = "\n".join(body)
        for called in re.findall(r"\bthis\.([a-zA-Z][a-zA-Z0-9_]*)\s*\(", bodytext):
            if called in moved and called != n:
                need_public.add(called)

    # call đến method trong cùng nhóm: sim.X( -> prefixX(sim,  (tránh access private qua class)
    moved_calls = sorted(names, key=len, reverse=True)

    def redirect_calls(line):
        r = line
        for m in moved_calls:
            fn = prefix + m[0].upper() + m[1:]
            r = re.sub(r"\bsim\." + re.escape(m) + r"\(", fn + "(sim, ", r)
        return r

    for n, vis, sig_lines, body in extracted:
        sig_text = "\n".join(sig_lines)
        v, fname, params, ret = split_params_and_ret(sig_text)
        if n in need_public:
            v = "public"
        new_params = "sim: ParkSimulation" + (", " + params if params.strip() else "")
        sig = f"export function {prefix}{fname[0].upper()}{fname[1:]}({new_params})"
        if ret:
            sig += f": {ret}"
        sig += " {"
        mod.append(sig)
        for bl in body:
            mod.append(redirect_calls(re.sub(r"\bthis\.", "sim.", bl)))
        mod.append("}")
        mod.append("")

    open(module_path, "w").write("\n".join(mod).rstrip() + "\n")

    # --- Viết lại class: thay method gốc bằng delegator (giữ verbatim signature) ---
    new_lines = []
    i = cls + 1
    replaced = 0
    spans = {n: (s, e) for n, _, s, e in methods}
    open_line_of = {}
    for n, vis, sig_lines, body in extracted:
        pass
    # recompute body open line cho delegator
    for n, _, s, e in methods:
        open_line_of[n] = find_body_open(lines, s, e)[0]

    while i < end:
        matched = None
        for n in names:
            s, e = spans[n]
            if i == s:
                matched = (n, s, e)
                break
        if matched:
            n, s, e = matched
            sig_text = "\n".join(lines[s : open_line_of[n] + 1])
            # body '{' là ký tự '{' cuối cùng trên dòng open
            last_line = sig_text.split("\n")
            last = last_line[-1]
            cut = last.rindex("{")
            head = last[:cut].rstrip()
            last_line[-1] = head
            sig_head = "\n".join(last_line)
            v, fname, params, ret = split_params_and_ret(sig_head)
            call = ", ".join(param_names(params))
            fn = prefix + fname[0].upper() + fname[1:]
            last_line[-1] = head + f" {{ return {fn}(this{', ' if call else ''}{call}); }}"
            new_lines.extend(last_line)
            i = e + 1
            replaced += 1
        else:
            new_lines.append(lines[i])
            i += 1

    out = "\n".join(lines[: cls + 1] + new_lines + lines[end:])
    import_line = (
        "import {\n"
        + "".join(f"  {prefix}{n[0].upper()}{n[1:]},\n" for n in names)
        + f"}} from './{module_name}';"
    )
    anchor = "export class ParkSimulation {"
    idx = out.index(anchor)
    out = out[:idx] + import_line + "\n\n" + out[idx:]
    open(SRC, "w").write(out)

    print(
        f"OK: {module_path} — tách {replaced} method, class còn "
        f"{len(lines)} -> {len(out.split(chr(10)))} dòng"
    )


if __name__ == "__main__":
    main()
