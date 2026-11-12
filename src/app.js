// Recipe Finder — original code by Clamor.
// TheMealDB (free, no API key). Falls back to built-in sample recipes when offline.
const API = "https://www.themealdb.com/api/json/v1/1";
const CUISINES = ["Indian","Italian","Mexican","Chinese","Thai","British","American","French","Japanese","Turkish","Greek","Spanish"];
function thumb(emoji, bg){ const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='${bg}'/><text x='300' y='230' font-size='150' text-anchor='middle'>${emoji}</text></svg>`; return "data:image/svg+xml," + encodeURIComponent(svg); }
// Built-in sample recipes (original summaries, generic dishes) for offline use.
const SAMPLE = [
 {idMeal:"s1",strMeal:"Garlic Butter Chicken",strMealThumb:thumb("🍗","#fde68a"),strCategory:"Chicken",strArea:"Indian",strTags:"quick,one-pan",
  ingredients:[["Chicken breast","500 g"],["Garlic","6 cloves"],["Butter","40 g"],["Lemon","1"],["Chilli flakes","1 tsp"],["Salt","to taste"]],
  strInstructions:"Heat butter in a pan and brown the chicken on both sides. Add garlic and chilli flakes and cook until fragrant. Squeeze in the lemon, season with salt, and simmer for 8 minutes until the chicken is cooked through. Rest for 5 minutes, then slice and serve with the pan sauce."},
 {idMeal:"s2",strMeal:"Tomato Basil Pasta",strMealThumb:thumb("🍝","#fecaca"),strCategory:"Pasta",strArea:"Italian",strTags:"vegetarian,quick",
  ingredients:[["Pasta","250 g"],["Tomatoes","400 g"],["Garlic","3 cloves"],["Basil","a handful"],["Olive oil","2 tbsp"],["Parmesan","to serve"]],
  strInstructions:"Boil the pasta in salted water until al dente. Meanwhile fry garlic in olive oil, add chopped tomatoes and simmer for 10 minutes. Toss the pasta through the sauce with torn basil. Serve with parmesan."},
 {idMeal:"s3",strMeal:"Paneer Butter Masala",strMealThumb:thumb("🧀","#fed7aa"),strCategory:"Vegetarian",strArea:"Indian",strTags:"curry,comfort",
  ingredients:[["Paneer","250 g"],["Tomatoes","3"],["Onion","1"],["Butter","30 g"],["Cream","3 tbsp"],["Garam masala","1 tsp"]],
  strInstructions:"Fry onion, then add tomatoes and cook until soft; blend smooth. Return to the pan with butter and garam masala, simmer 5 minutes, add paneer cubes and cream, and cook 3 more minutes. Serve with naan or rice."},
 {idMeal:"s4",strMeal:"Veg Fried Rice",strMealThumb:thumb("🍚","#bbf7d0"),strCategory:"Rice",strArea:"Chinese",strTags:"quick,leftovers",
  ingredients:[["Cooked rice","2 cups"],["Mixed vegetables","1 cup"],["Soy sauce","2 tbsp"],["Garlic","2 cloves"],["Spring onion","2"],["Egg","1 (optional)"]],
  strInstructions:"Fry garlic, add vegetables and stir-fry for 3 minutes. Push aside, scramble the egg, then add rice and soy sauce. Toss on high heat for 2 minutes and finish with spring onion."},
 {idMeal:"s5",strMeal:"Chickpea Salad Bowl",strMealThumb:thumb("🥗","#bef264"),strCategory:"Salad",strArea:"Mexican",strTags:"healthy,no-cook",
  ingredients:[["Chickpeas","1 can"],["Cucumber","1"],["Tomato","1"],["Red onion","half"],["Lemon juice","1 tbsp"],["Cumin","half tsp"]],
  strInstructions:"Rinse the chickpeas and chop the vegetables. Toss everything with lemon juice, cumin and salt. Chill for 15 minutes before serving."}
];
const $=id=>document.getElementById(id);
let currentMeals=[], favs=new Set(JSON.parse(localStorage.getItem("rf-favs")||"[]"));
let favMeals=JSON.parse(localStorage.getItem("rf-fav-meals")||"[]");
function saveFavs(){ localStorage.setItem("rf-favs",JSON.stringify([...favs])); localStorage.setItem("rf-fav-meals",JSON.stringify(favMeals)); $("favCount").textContent=favs.size; renderFavs(); }
function isFav(id){ return favs.has(String(id)); }
function toggleFav(meal){ const id=String(meal.idMeal);
  if(isFav(id)){ favs.delete(id); favMeals=favMeals.filter(m=>String(m.idMeal)!==id); }
  else { favs.add(id); favMeals.push(meal); }
  saveFavs(); renderResults(currentMeals); updateModalFav(meal); }
function ingredientsOf(m){ if(m.ingredients) return m.ingredients;
  const out=[]; for(let i=1;i<=20;i++){ const ing=m["strIngredient"+i], ms=m["strMeasure"+i]; if(ing&&ing.trim()) out.push([ing.trim(),(ms||"").trim()]); } return out; }
function normalise(m){ return {idMeal:String(m.idMeal),strMeal:m.strMeal,strMealThumb:m.strMealThumb,strCategory:m.strCategory||"",strArea:m.strArea||"",strTags:m.strTags||"",ingredients:ingredientsOf(m),strInstructions:m.strInstructions||"",strSource:m.strSource||"",strYoutube:m.strYoutube||""}; }
async function api(path){ const r=await fetch(API+path); if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); }
function cardHTML(m, match){ return `<article class="card" data-id="${m.idMeal}" tabindex="0"><img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy"><div class="card-body"><h3>${m.strMeal}</h3><p>${m.strArea||""} · ${m.strCategory||""}</p></div><div class="card-actions">${match?`<span class="match">✓ ${match}/3 ingredients</span>`:`<span class="muted">${(m.strTags||"").split(",")[0]||"Recipe"}</span>`}<button type="button" class="fav-btn" data-fav="${m.idMeal}" aria-label="Toggle favourite">${isFav(m.idMeal)?"❤️":"🤍"}</button></div></article>`; }
function renderResults(meals, matchMap){ currentMeals=meals; $("results").innerHTML=meals.length?meals.map(m=>cardHTML(m, matchMap?matchMap[m.idMeal]:null)).join(""):"<p class='muted'>No recipes found — try another search.</p>"; bindCards($("results")); }
function renderFavs(){ $("favGrid").innerHTML=favMeals.length?favMeals.map(m=>cardHTML(m)).join(""):"<p class='muted'>No favourites yet. Tap 🤍 on any recipe to save it here.</p>"; bindCards($("favGrid")); }
function bindCards(root){ root.querySelectorAll(".card").forEach(c=>{ c.onclick=e=>{ if(e.target.closest("[data-fav]")) return; openModal(c.dataset.id); }; c.onkeydown=e=>{ if(e.key==="Enter") openModal(c.dataset.id); }; });
  root.querySelectorAll("[data-fav]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); const m=[...currentMeals,...favMeals].find(x=>String(x.idMeal)===b.dataset.fav); if(m) toggleFav(m); }); }
async function searchRecipes(q, mode){ $("status").textContent="Searching…";
  try{ let meals=null;
    if(mode==="ingredient"){ const j=await api("/filter.php?i="+encodeURIComponent(q)); meals=j.meals; }
    else { const j=await api("/search.php?s="+encodeURIComponent(q)); meals=j.meals; }
    if(!meals){ $("status").textContent="No recipes found for “"+q+"”."; renderResults([]); return; }
    // filter.php returns only id/name/thumb — fetch details for the first 12.
    const detailed=[]; for(const m of meals.slice(0,12)){ try{ const d=await api("/lookup.php?i="+m.idMeal); if(d.meals) detailed.push(normalise(d.meals[0])); }catch(e){ detailed.push(normalise(m)); } }
    $("status").textContent=`${detailed.length} recipe(s) for “${q}” — live from TheMealDB.`; renderResults(detailed);
  }catch(e){ const ql=q.toLowerCase(); const hits=SAMPLE.filter(m=>m.strMeal.toLowerCase().includes(ql)||m.ingredients.some(([i])=>i.toLowerCase().includes(ql)));
    $("status").textContent="Offline — showing built-in sample recipes matching “"+q+"”."; renderResults(hits.length?hits:SAMPLE); } }
async function surprise(){ $("status").textContent="Picking a random recipe…";
  try{ const j=await api("/random.php"); renderResults([normalise(j.meals[0])]); $("status").textContent="Surprise recipe — live from TheMealDB."; openModal(j.meals[0].idMeal); }
  catch(e){ const m=SAMPLE[Math.floor(Math.random()*SAMPLE.length)]; renderResults([m]); $("status").textContent="Offline — a sample surprise recipe."; openModal(m.idMeal); } }
function openModal(id){ const m=[...currentMeals,...favMeals,...SAMPLE].find(x=>String(x.idMeal)===String(id)); if(!m) return;
  $("modalImg").src=m.strMealThumb; $("modalImg").alt=m.strMeal; $("modalTitle").textContent=m.strMeal;
  $("modalMeta").textContent=`${m.strArea||""} · ${m.strCategory||""} · ${ingredientsOf(m).length} ingredients`;
  $("modalIngredients").innerHTML=ingredientsOf(m).map(([i,ms])=>`<li><strong>${i}</strong> — ${ms||"to taste"}</li>`).join("");
  $("modalSteps").innerHTML=(m.strInstructions||"").split(/\r?\n+/).filter(s=>s.trim().length>3).map(s=>`<li>${s.trim()}</li>`).join("")||"<li>See the source link for full steps.</li>";
  $("modalSource").textContent=m.strSource?("Source: "+m.strSource):(m.strYoutube?("Video: "+m.strYoutube):"");
  $("modalFav").onclick=()=>toggleFav(m); updateModalFav(m); $("modal").hidden=false; }
function updateModalFav(m){ $("modalFav").textContent=isFav(m.idMeal)?"❤️ Saved in favourites":"🤍 Save to favourites"; }
$("modalClose").onclick=()=>$("modal").hidden=true;
$("modal").addEventListener("click",e=>{ if(e.target===$("modal")) $("modal").hidden=true; });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") $("modal").hidden=true; });
$("searchForm").addEventListener("submit",e=>{ e.preventDefault(); const q=$("query").value.trim(); if(q) searchRecipes(q,$("searchMode").value); });
$("surpriseBtn").onclick=surprise;
$("cuisineChips").innerHTML=CUISINES.map(c=>`<button type="button" data-area="${c}">${c}</button>`).join("");
$("cuisineChips").querySelectorAll("button").forEach(b=>b.onclick=async()=>{ $("status").textContent="Loading "+b.dataset.area+" recipes…";
  try{ const j=await api("/filter.php?a="+encodeURIComponent(b.dataset.area)); const meals=(j.meals||[]).slice(0,12); const det=[]; for(const m of meals){ try{ const d=await api("/lookup.php?i="+m.idMeal); if(d.meals) det.push(normalise(d.meals[0])); }catch(e){ det.push(normalise(m)); } } $("status").textContent=`${det.length} ${b.dataset.area} recipes.`; renderResults(det); }
  catch(e){ const hits=SAMPLE.filter(m=>m.strArea===b.dataset.area); $("status").textContent="Offline — sample "+b.dataset.area+" recipes."; renderResults(hits.length?hits:SAMPLE); } });
$("pantryForm").addEventListener("submit",async e=>{ e.preventDefault();
  const ings=[$("ing1").value,$("ing2").value,$("ing3").value].map(s=>s.trim().toLowerCase()).filter(Boolean);
  if(!ings.length){ $("pantryStatus").textContent="Type at least one ingredient you own."; return; }
  $("pantryStatus").textContent="Ranking recipes by how many of your ingredients they use…";
  let pool=[]; try{ const seen=new Set(); for(const ing of ings){ const j=await api("/filter.php?i="+encodeURIComponent(ing)); (j.meals||[]).forEach(m=>{ if(!seen.has(m.idMeal)){ seen.add(m.idMeal); pool.push(m); } }); }
    const det=[]; for(const m of pool.slice(0,20)){ try{ const d=await api("/lookup.php?i="+m.idMeal); if(d.meals) det.push(normalise(d.meals[0])); }catch(_){} } pool=det; }
  catch(err){ pool=SAMPLE; $("pantryStatus").textContent="Offline — ranking the built-in sample recipes."; }
  const scored=pool.map(m=>({m,score:ings.filter(ing=>ingredientsOf(m).some(([i])=>i.toLowerCase().includes(ing))).length})).filter(s=>s.score>0).sort((a,b)=>b.score-a.score);
  const matchMap={}; scored.forEach(s=>matchMap[s.m.idMeal]=s.score);
  $("pantryResults").innerHTML=scored.length?scored.map(s=>cardHTML(s.m,s.score)).join(""):"<p class='muted'>No recipe uses those ingredients — try a more common one like chicken or garlic.</p>";
  bindCards($("pantryResults")); if(scored.length) $("pantryStatus").textContent=`${scored.length} match(es) — best match uses ${scored[0].score} of your ${ings.length} ingredient(s).`; });
function showView(v){ ["searchView","favsView","pantryView"].forEach(id=>$(id).hidden=id!==v);
  ["tabSearch","tabFavs","tabPantry"].forEach((id,i)=>$(id).classList.toggle("active",["searchView","favsView","pantryView"][i]===v)); }
$("tabSearch").onclick=()=>showView("searchView"); $("tabFavs").onclick=()=>showView("favsView"); $("tabPantry").onclick=()=>showView("pantryView");
$("favCount").textContent=favs.size; renderFavs(); renderResults(SAMPLE);
