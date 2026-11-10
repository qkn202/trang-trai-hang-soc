#!/usr/bin/env python3
"""
Tách method của một class lớn sang module domain theo pattern delegation.

Cách dùng
---------
  python3 tools/split-class-methods.py [--src <src_file>] [--class <ClassName>] [--param <paramName>] \
    <module_path> <module_name> <prefix> <m1,m2,...>
"""
import os
import re
import sys


def scan_method(lines, start, cls_end):
    """Từ dòng bắt đầu method `start`, trả về (body_open_line, body_open_col, end_line)."""
    col = lines[start].index("(")
    p_depth = 0
    j = start
    ci = col
    while j < cls_end:
        line = lines[j]
        while ci < len(line):
            ch = line[ci]
            if ch == "(":
                p_depth += 1
            elif ch == ")":
                p_depth -= 1
                if p_depth == 0:
                    ci += 1
                    break
            ci += 1
        if p_depth == 0:
            break
        j += 1
        ci = 0

    b_depth = 0
    open_pos = None
    while j < cls_end:
        line = lines[j]
        while ci < len(line):
            ch = line[ci]
            if ch == "{":
                if b_depth == 0:
                    open_pos = (j, ci)
                b_depth += 1
            elif ch == "}":
                b_depth -= 1
                if b_depth == 0 and open_pos is not None:
                    rest = line[ci + 1 :].strip()
                    if rest == "":
                        return open_pos[0], open_pos[1], j
            ci += 1
        j += 1
        ci = 0

    raise SystemExit(f"ERROR: không tìm thấy điểm đóng cho method tại dòng {start + 1}")


def parse_methods(lines, cls, end):
    """Trả về list (name, vis, start, end)."""
    methods = []
    i = cls + 1
    while i < end:
        m = re.match(r"^  (public|private) ([a-zA-Z][a-zA-Z0-9_]*)\(", lines[i])
        if not m:
            i += 1
            continue
        _, _, m_end = scan_method(lines, i, end)
        methods.append((m.group(2), m.group(1), i, m_end))
        i = m_end + 1
    return methods


def find_body_open(lines, start, end):
    """Trả về (body_open_line, brace_col, sig_lines); sig_lines = signature tới '{' mở thân."""
    bi, bci, _ = scan_method(lines, start, end + 1)
    sig = list(lines[start : bi + 1])
    sig[-1] = sig[-1][:bci].rstrip()
    return bi, bci, sig


def split_params_and_ret(sig_text):
    """Chia signature (không có '{') thành (vis, name, params, ret)."""
    m = re.match(
        r"^\s*(public|private)\s+([a-zA-Z][a-zA-Z0-9_]*)\s*\(", sig_text, re.S
    )
    if not m:
        raise SystemExit(f"ERROR: không parse đầu signature: {sig_text[:80]!r}")
    vis, fname = m.group(1), m.group(2)
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
    """Tên tham số ở top-level (bỏ default value, type annotation và dấu '?')."""
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
        names.append(a.replace("?", "").strip())
    return names


def main():
    args = sys.argv[1:]
    src_path = "src/sim/simulation.ts"
    class_name = "ParkSimulation"
    param_name = "sim"
    while args and args[0].startswith("--"):
        flag = args.pop(0)
        if flag == "--src":
            src_path = args.pop(0)
        elif flag == "--class":
            class_name = args.pop(0)
        elif flag == "--param":
            param_name = args.pop(0)
        else:
            raise SystemExit(f"Unknown flag: {flag}")

    if len(args) < 4:
        raise SystemExit(__doc__)
    module_path, module_name, prefix = args[0], args[1], args[2]
    names = args[3].split(",")

    src_dir = os.path.dirname(src_path)
    src_base = os.path.splitext(os.path.basename(src_path))[0]

    src = open(src_path).read()
    lines = src.split("\n")

    cls = next(i for i, l in enumerate(lines) if l.startswith(f"export class {class_name}"))
    end = max(i for i, l in enumerate(lines) if l == "}")

    methods = parse_methods(lines, cls, end)
    by_name = {m[0]: m for m in methods}
    missing = [n for n in names if n not in by_name]
    if missing:
        sys.exit(f"ERROR: không tìm thấy method trong class {class_name}: {missing}")

    extracted = []
    for n in names:
        _, vis, s, e = by_name[n]
        body_open, _, sig_lines = find_body_open(lines, s, e)
        body = lines[body_open + 1 : e]
        while body and body[-1].strip() == "":
            body.pop()
        extracted.append((n, vis, sig_lines, body))

    moved = set(names)
    need_public = set()
    for n, vis, sig_lines, body in extracted:
        if vis != "private":
            continue
        for called in re.findall(
            r"\bthis\.([a-zA-Z][a-zA-Z0-9_]*)\s*\(", "\n".join(body)
        ):
            if called in moved and called != n:
                need_public.add(called)

    moved_calls = sorted(names, key=len, reverse=True)

    def redirect_calls(line):
        r = line
        for m in moved_calls:
            fn = prefix + m[0].upper() + m[1:]
            r = re.sub(r"\b" + re.escape(param_name) + r"\." + re.escape(m) + r"\(\)", fn + f"({param_name})", r)
            r = re.sub(r"\b" + re.escape(param_name) + r"\." + re.escape(m) + r"\(", fn + f"({param_name}, ", r)
        return r

    mod = [
        f"// Tách tự động từ {src_path} (P0 — tách god file theo domain).",
        f"// Pattern delegation: hàm nhận `{param_name}` để giữ nguyên state, không đổi hành vi.",
        "",
    ]

    in_block = False
    for l in lines[:cls]:
        st = l.strip()
        if st.startswith("export {") or st.startswith("export type {"):
            break
        if st.startswith("import "):
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
    mod.append(f"import type {{ {class_name} }} from './{src_base}';")
    mod.append("")

    for n, vis, sig_lines, body in extracted:
        v, fname, params, ret = split_params_and_ret("\n".join(sig_lines))
        if n in need_public:
            v = "public"
        new_params = f"{param_name}: {class_name}" + (", " + params if params.strip() else "")
        sig = f"export function {prefix}{fname[0].upper()}{fname[1:]}({new_params})"
        if ret:
            sig += f": {ret}"
        mod.append(sig + " {")
        for bl in body:
            mod.append(redirect_calls(re.sub(r"\bthis\.", f"{param_name}.", bl)))
        mod.append("}")
        mod.append("")

    open(module_path, "w").write("\n".join(mod).rstrip() + "\n")

    new_lines = []
    spans = {n: (s, e) for n, _, s, e in methods}
    body_info = {n: find_body_open(lines, s, e) for n, _, s, e in methods}

    i = cls + 1
    replaced = 0
    while i < end:
        matched = next((n for n in names if spans[n][0] == i), None)
        if matched:
            n = matched
            s, e = spans[n]
            bi, bci, _ = body_info[n]
            sig_lines = list(lines[s : bi + 1])
            head = sig_lines[-1][:bci].rstrip()
            v, fname, params, ret = split_params_and_ret("\n".join(sig_lines[:-1] + [head]))
            call = ", ".join(param_names(params))
            fn = prefix + fname[0].upper() + fname[1:]
            sig_lines[-1] = head + f" {{ return {fn}(this{', ' if call else ''}{call}); }}"
            new_lines.extend(sig_lines)
            i = e + 1
            replaced += 1
        else:
            new_lines.append(lines[i])
            i += 1

    out = "\n".join(lines[: cls + 1] + new_lines + lines[end:])

    all_mod_contents = "\n".join(
        open(os.path.join(src_dir, fn)).read()
        for fn in os.listdir(src_dir)
        if fn.endswith(".ts") and os.path.join(src_dir, fn) != src_path
    )
    priv_names = [n for n, vis, _, _ in methods if vis == "private"]
    for pn in priv_names:
        if re.search(r"\b" + re.escape(param_name) + r"\." + re.escape(pn) + r"\s*\(", all_mod_contents):
            out = re.sub(
                r"^(  )private (" + re.escape(pn) + r"\()", r"\1public \2", out, flags=re.M
            )
            print(f"  auto-public method: {pn}")

    for m_field in re.finditer(r"^  private ([a-zA-Z][a-zA-Z0-9_]*)\b", out, flags=re.M):
        fn_field = m_field.group(1)
        if fn_field in priv_names:
            continue
        if re.search(r"\b" + re.escape(param_name) + r"\." + re.escape(fn_field) + r"\b", all_mod_contents):
            out = re.sub(
                r"^(  )private (" + re.escape(fn_field) + r"\b)",
                r"\1public \2",
                out,
                flags=re.M,
            )
            print(f"  auto-public field: {fn_field}")

    import_line = (
        "import {\n"
        + "".join(f"  {prefix}{n[0].upper()}{n[1:]},\n" for n in names)
        + f"}} from './{module_name}';"
    )
    anchor = f"export class {class_name} {{"
    idx = out.index(anchor)
    out = out[:idx] + import_line + "\n\n" + out[idx:]
    open(src_path, "w").write(out)

    print(
        f"OK: {module_path} — tách {replaced} method, class còn "
        f"{len(lines)} -> {len(out.split(chr(10)))} dòng"
    )


if __name__ == "__main__":
    main()
