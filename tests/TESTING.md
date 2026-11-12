# Testing

## Automated
Run: `python3 tests/test_html.py`

## Manual checklist
- [ ] Open `src/index.html` — 5 sample recipes show on load.
- [ ] Search "chicken" by name — live results appear (or sample matches offline).
- [ ] Search by ingredient "garlic" — results contain garlic.
- [ ] Click a card — modal opens with ingredients and numbered steps; Escape closes it.
- [ ] Tap 🤍 on a recipe — Favourites count rises; the Favourites tab lists it; reload keeps it.
- [ ] "Surprise me" — a random recipe opens in the modal.
- [ ] Pantry: enter chicken, garlic — results are ranked with a "✓ 2/3 ingredients" badge on the best match.
- [ ] Turn off the network and reload — sample recipes still work, with an offline notice.
