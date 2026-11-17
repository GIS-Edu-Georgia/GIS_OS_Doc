#!/usr/bin/env python3
"""Regenerate docs/Dev_ops/Fundamentals/linux/linux-cheatsheet.pdf from cheatsheet.md.
Usage: python3 scripts/make_cheatsheet_pdf.py docs/Dev_ops/Fundamentals/linux/cheatsheet.md OUT.pdf https://osdoc.qgis.ge/Dev_ops/Fundamentals/
Needs: pip install weasyprint markdown (fonts: DejaVu). Mermaid blocks are omitted; relative ../x.md links become absolute <base>/x/ links."""
import re, sys, markdown, weasyprint
src_path, out_path, base = sys.argv[1], sys.argv[2], sys.argv[3].rstrip('/') + '/'
src = open(src_path, encoding='utf-8').read()
src = re.sub(r"^📄 \*\*\[ჩამოტვირთე PDF ვერსია\].*\n\n?", "", src, flags=re.M)  # the PDF must not link to itself
src = re.sub(r"```mermaid.*?```\n", "", src, flags=re.S)
src = re.sub(r"## რუკა:.*?\n---\n", "", src, flags=re.S)
src = re.sub(r"\]\(\.\./([^)]+?)\.md\)", lambda m: "](" + base + m.group(1) + "/)", src)
html = markdown.markdown(src, extensions=["tables","fenced_code","admonition","attr_list","toc"])
css = """
@page{size:A4;margin:14mm 12mm;@bottom-center{content:counter(page) ' / ' counter(pages);font-size:8pt;color:#777}}
body{font-family:'DejaVu Sans',sans-serif;font-size:8.2pt;line-height:1.35;color:#111}
h1{font-size:17pt;color:#1b5e20;border-bottom:2px solid #1b5e20;margin:0 0 6pt}
h2{font-size:11.5pt;color:#fff;background:#2e7d32;padding:3pt 6pt;margin:12pt 0 4pt;break-after:avoid}
h3{font-size:9.5pt;color:#1b5e20;margin:8pt 0 3pt;break-after:avoid}
table{border-collapse:collapse;width:100%;margin:3pt 0;break-inside:auto}
tr{break-inside:avoid}
th{background:#e8f5e9;text-align:left}
th,td{border:.5pt solid #bbb;padding:2pt 4pt;vertical-align:top}
code{font-family:'DejaVu Sans Mono',monospace;font-size:7.6pt;background:#f1f3f4;padding:0 1.5pt}
pre{background:#f1f3f4;padding:4pt;font-size:7.4pt;white-space:pre-wrap;break-inside:avoid}
pre code{background:none}
.admonition{border-left:3pt solid #f57c00;background:#fff8e1;padding:3pt 6pt;margin:4pt 0}
.admonition.danger,.admonition.warning{border-color:#c62828;background:#ffebee}
.admonition-title{font-weight:bold;margin:0}
a{color:#1b5e20;text-decoration:none}
"""
weasyprint.HTML(string=f"<meta charset=utf-8><html lang=ka><body>{html}</body></html>").write_pdf(out_path, stylesheets=[weasyprint.CSS(string=css)])
