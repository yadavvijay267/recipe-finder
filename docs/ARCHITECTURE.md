# Architecture

## Flow
`index.html` -> `styles.css` -> `app.js` (all logic, no framework).

## Data
- Live: TheMealDB free API (`www.themealdb.com/api/json/v1/1`, no key).
  - `search.php?s=` — by dish name. `filter.php?i=` — by ingredient. `filter.php?a=` — by cuisine. `lookup.php?i=` — full detail. `random.php` — surprise recipe.
- `filter.php` returns only id/name/thumb, so the app fetches full details (ingredients, steps) for the first 12 results.
- Offline: any failed fetch falls back to 5 built-in sample recipes (`SAMPLE` in `app.js`), with an "Offline" notice in the status line.

## Favourites
Meal IDs in `localStorage` (`rf-favs`) plus the full meal objects (`rf-fav-meals`) so favourites render even offline.

## Cook with what you have
The pantry form takes up to 3 ingredients, fetches recipes for each, scores every recipe by how many of the user's ingredients appear in its ingredient list, and sorts best-match first. The match count is shown as a badge on each card.

## Detail modal
Clicking a card opens a modal with the photo, cuisine/category, full ingredient list with measurements, and numbered steps. Escape, backdrop click, or the ✕ button closes it.
