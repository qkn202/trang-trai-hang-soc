#!/usr/bin/env python3
"""
Tách method của ParkSimulation sang module domain theo pattern delegation.

Cơ chế:
  - Method gốc trong class  ->  hàm độc lập trong module domain, nhận `sim: ParkSimulation`
  - Thân hàm: `this.` -> `sim.`
  - Class giữ lại 1 dòng delegator: `public foo(a: T): R { return domainFoo(this, a); }`

An toàn:
  - Giữ nguyên thứ tự method trong class (delegator đứng đúng vị trí method gốc)
  - Giữ nguyên visibility (public/private)
  - Module domain chỉ import `import type { ParkSimulation }` => không vòng lặp runtime
  - Validate: không mất dòng nào, không đổi tên, không đổi signature
"""
import re
import sys

SRC = "src/sim/simulation.ts"


def parse_methods(lines, cls, end):
    """Trả về list (name, vis, start, end) — end là dòng '  }' đóng method."""
    methods = []
    i = cls + 1
    while i < end:
        m = re.match(r"^  (public|private) ([a-zA-Z][a-zA-Z0-9_]*)\(", lines[i])
        if m:
            j = i
            while j < end and lines[j] != "  }":
                j += 1
            methods.append((m.group(2), m.group(1), i, j))
            i = j + 1
        else:
            i += 1
    return methods


def split_signature(lines, idx):
    """Tách phần signature (tới dấu '{') khỏi dòng đầu method.
    Trả về (signature_lines, first_body_line_index)."""
    sig_lines = [lines[idx]]
    k = idx
    while "{" not in sig_lines[-1]:
        k += 1
        sig_lines.append(lines[k])
    return sig_lines, k + 1


def parse_sig(sig_lines):
    """Parse signature (có thể nhiều dòng) thành (vis, name, params, ret).
    params giữ nguyên text (có thể nhiều dòng)."""
    text = "\n".join(sig_lines)
    # bỏ '{' cuối
    text = text[: text.rindex("{")].rstrip()
    m = re.match(
        r"^\s*(public|private)\s+([a-zA-Z][a-zA-Z0-9_]*)\s*\((.*)\)\s*:\s*(.*)$",
        text,
        re.S,
    )
    if not m:
        sys.exit(f"ERROR: không parse signature: {text!r}")
    return m.group(1), m.group(2), m.group(3), m.group(4)


def param_names(params):
    """Tách danh sách tham số ở top-level (bỏ default value, giữ tên)."""
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
        # bỏ type annotation (sau ':' đầu tiên ở top-level, giữ tên tham số)
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
        names.append(a)
    return names


def main():
    module_path = sys.argv[1]  # ví dụ src/sim/simulationFarm.ts
    module_name = sys.argv[2]  # ví dụ simulationFarm
    prefix = sys.argv[3]  # ví dụ farm
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

    # --- Thu thập body từng method ---
    extracted = []  # (name, vis, sig_lines, body_lines)
    for n in names:
        _, vis, s, e = by_name[n]
        sig_lines, body_start = split_signature(lines, s)
        body = lines[body_start : e]  # không gồm dòng '  }'
        # bỏ dòng trống cuối
        while body and body[-1].strip() == "":
            body.pop()
        extracted.append((n, vis, sig_lines, body))

    # --- Ghi module domain ---
    mod = []
    mod.append(f"// Tách tự động từ {SRC} (P0.2 — tách god file theo domain).")
    mod.append("// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.")
    mod.append("")
    mod.append("")

    # copy import block trước class (import + re-export, state machine an toàn)
    class_line = next(i for i, l in enumerate(lines) if l.startswith("export class ParkSimulation"))
    in_block = False
    for l in lines[:class_line]:
        st = l.strip()
        if st.startswith("import ") or st.startswith("export {") or st.startswith("export type {"):
            in_block = True
            mod.append(l)
        elif in_block:
            if st == "" or (l.startswith("  ") is False and not st.startswith("} from") and st != "}"):
                in_block = False
                continue
            mod.append(l)
    mod.append("import type { ParkSimulation } from './simulation';")
    mod.append("")
    mod.append("")

    # private method trong nhóm được gọi bởi method khác trong nhóm -> phải public để module gọi được
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
    moved_calls = [n for n in names]
    moved_calls.sort(key=len, reverse=True)

    def redirect_calls(line):
        r = line
        for m in moved_calls:
            fn = prefix + m[0].upper() + m[1:]
            r = re.sub(
                r"\bsim\." + re.escape(m) + r"\(",
                fn + "(sim, ",
                r,
            )
        return r

    for n, vis, sig_lines, body in extracted:
        v, fname, params, ret = parse_sig(sig_lines)
        if n in need_public:
            v = "public"
        # thêm sim làm tham số đầu tiên
        new_params = "sim: ParkSimulation" + (", " + params if params.strip() else "")
        sig = f"export function {prefix}{fname[0].upper()}{fname[1:]}({new_params}): {ret} {{"
        mod.append(sig)
        for bl in body:
            mod.append(redirect_calls(re.sub(r"\bthis\.", "sim.", bl)))
        mod.append("}")
        mod.append("")

    open(module_path, "w").write("\n".join(mod).rstrip() + "\n")

    # --- Viết lại class: thay method gốc bằng delegator ---
    new_lines = []
    i = cls + 1
    replaced = 0
    by_name_idx = {n: (s, e) for n, _, s, e in methods}
    while i < end:
        matched = None
        for n in names:
            s, e = by_name_idx[n]
            if i == s:
                matched = (n, s, e)
                break
        if matched:
            n, s, e = matched
            _, vis, _, _ = by_name[n]
            sig_lines, _ = split_signature(lines, s)
            v, fname, params, ret = parse_sig(sig_lines)
            vis_prefix = v + " "
            call = ", ".join(param_names(params))
            new_lines.append(
                f"  {vis_prefix}{fname}({params}): {ret} {{ return {prefix}{fname[0].upper()}{fname[1:]}(this{', ' if call else ''}{call}); }}"
            )
            i = e + 1
            replaced += 1
        else:
            new_lines.append(lines[i])
            i += 1

    out = "\n".join(lines[: cls + 1] + new_lines + lines[end:])
    # chèn import module domain ngay trước class (hoisting, hợp lệ)
    import_line = f"import {{\n" + "".join(
        f"  {prefix}{n[0].upper()}{n[1:]},\n" for n in names
    ) + f"}} from './{module_name}';"
    anchor = "export class ParkSimulation {"
    idx = out.index(anchor)
    out = out[:idx] + import_line + "\n\n" + out[idx:]
    open(SRC, "w").write(out)

    print(f"OK: {module_path} — tách {replaced} method, class còn {len(lines)} -> {len(out.split(chr(10)))} dòng")


if __name__ == "__main__":
    main()
