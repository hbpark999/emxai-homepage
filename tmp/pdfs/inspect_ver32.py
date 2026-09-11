from pathlib import Path

import pymupdf
from pypdf import PdfReader


source = Path("content/education-materials/동양미래대] 생성형AI의 EMI_SI분석 활용 20260911ver3.2.pdf")
reader = PdfReader(source)
page_count = len(reader.pages)
print("pages", page_count)
print("encrypted", reader.is_encrypted)
print("size", source.stat().st_size)

document = pymupdf.open(source)
output = Path("tmp/pdfs/ver32-check")
output.mkdir(parents=True, exist_ok=True)
for index in sorted({0, page_count // 2, page_count - 1}):
    pixmap = document[index].get_pixmap(matrix=pymupdf.Matrix(0.5, 0.5), alpha=False)
    pixmap.save(output / f"page-{index + 1}.png")
print("rendered", *(str(path) for path in sorted(output.glob("*.png"))))
