# Recipe Finder App

Search recipes by dish name, ingredient, or cuisine, view full details, save favourites, and find what to cook with the ingredients you already have.

## Features
- Ingredient- and name-based search with live results from TheMealDB (free, no key).
- Recipe detail modal with ingredients, measurements, and numbered steps.
- Favourites saved to localStorage — they survive reloads and work offline.
- Random-recipe "Surprise me" button.
- Cuisine quick-pick chips (Indian, Italian, Mexican, Chinese, and more).
- **Cook with what you have:** type up to 3 ingredients you own and recipes are ranked by match, best first.

## Tech stack
HTML, CSS Grid, vanilla JavaScript, TheMealDB API (free, no key), localStorage.

## How to run
Open `src/index.html` in any modern browser. No build step, no server, no API key.
Or serve it locally: `python3 -m http.server --directory src 8000` then visit `http://localhost:8000`.

## Screenshots
See `screenshots/SCREENSHOTS.md` — add `search.png`, `detail.png` and `pantry.png` there after running the app.

## Tests
`python3 tests/test_html.py` — automated HTML/JS checks. Manual checklist in `tests/TESTING.md`.

## License
MIT — see `LICENSE`. Built by Clamor.
