"""Automated checks for the Recipe Finder. Run: python3 tests/test_html.py"""
import pathlib, sys
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "src" / "index.html").read_text()
js = (root / "src" / "app.js").read_text()
checks = [
    ("references styles.css", "styles.css" in html),
    ("references app.js", "app.js" in html),
    ("has search form", 'id="searchForm"' in html),
    ("has favourites view", 'id="favsView"' in html),
    ("has pantry view", 'id="pantryView"' in html),
    ("has detail modal", 'id="modal"' in html),
    ("has surprise button", 'id="surpriseBtn"' in html),
    ("JS calls TheMealDB", "themealdb.com" in js),
    ("JS has sample fallback", "SAMPLE" in js and "Offline" in js),
    ("JS saves favourites to localStorage", "rf-favs" in js),
    ("JS ranks pantry matches", "score" in js and "sort" in js),
    ("README exists", (root / "README.md").exists()),
]
failed = [n for n, ok in checks if not ok]
for n, ok in checks: print(("PASS " if ok else "FAIL ") + n)
if failed: print(f"{len(failed)} check(s) failed"); sys.exit(1)
print("All checks passed.")
