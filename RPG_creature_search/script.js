// API docs: https://rpg-creature-api.freecodecamp.rocks/

const CREATURE_ENDPOINT = "https://rpg-creature-api.freecodecamp.rocks/api/creature/";

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");

const nameEl   = document.getElementById("creature-name");
const idEl     = document.getElementById("creature-id");
const weightEl = document.getElementById("weight");
const heightEl = document.getElementById("height");
const typesEl  = document.getElementById("types");

const hpEl   = document.getElementById("hp");
const atkEl  = document.getElementById("attack");
const defEl  = document.getElementById("defense");
const spaEl  = document.getElementById("special-attack");
const spdEl  = document.getElementById("special-defense");
const speEl  = document.getElementById("speed");

const imgEl  = document.getElementById("creature-image");

// Normalize a user entry: IDs stay as-is, names become lowercase
const normalizeQuery = (raw) => {
  const trimmed = String(raw).trim();
  if (/^\d+$/.test(trimmed)) return trimmed;        // an ID
  return trimmed.toLowerCase();                      // a name
};


const makeStatsGetter = (statsArr = []) => {
  // Accept both { stat: { name }, base_stat } and { name, base_stat/value }
  const map = new Map();
  for (const s of statsArr) {
    const key = (s?.stat?.name || s?.name || "").toLowerCase();
    const val = s?.base_stat ?? s?.value ?? s;
    if (key) map.set(key, val);
  }
  return (key) => map.get(String(key).toLowerCase()) ?? "";
};

const clearUI = () => {
  nameEl.textContent = "—";
  idEl.textContent = "—";
  weightEl.textContent = "—";
  heightEl.textContent = "—";
  typesEl.innerHTML = "";
  hpEl.textContent = atkEl.textContent = defEl.textContent =
  spaEl.textContent = spdEl.textContent = speEl.textContent = "—";
  if (imgEl) {
    imgEl.src = "";
    imgEl.alt = "";
  }
};

const fillUI = (creature) => {
  // Name / ID
  nameEl.textContent = String(creature.name || "").toUpperCase();
  idEl.textContent   = typeof creature.id !== "undefined" ? `#${creature.id}` : "—";

  // Weight / Height — tests accept "42" or "Weight: 42"
  weightEl.textContent = typeof creature.weight !== "undefined" ? `Weight: ${creature.weight}` : "—";
  heightEl.textContent = typeof creature.height !== "undefined" ? `Height: ${creature.height}` : "—";

  // Types — clear between searches
  typesEl.innerHTML = "";
  const rawTypes = creature.types || [];
  rawTypes.forEach(t => {
    const name = (t?.type?.name || t?.name || "").toUpperCase();
    if (!name) return;
    const li = document.createElement("li");
    li.textContent = name;
    typesEl.appendChild(li);
  });


  const stat = makeStatsGetter(creature.stats);
  hpEl.textContent  = stat("hp");
  atkEl.textContent = stat("attack");
  defEl.textContent = stat("defense");
  spaEl.textContent = stat("special-attack");
  spdEl.textContent = stat("special-defense");
  speEl.textContent = stat("speed");


  const img =
    creature?.sprites?.front_default ||
    creature?.image ||
    "";
  if (imgEl && img) {
    imgEl.src = img;
    imgEl.alt = creature.name ? `${creature.name} artwork` : "creature";
  }
};

const fetchCreature = async (query) => {

  const url = CREATURE_ENDPOINT + encodeURIComponent(query);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Creature not found");
  return res.json();
};

const handleSearch = async (e) => {
  e.preventDefault();
  const raw = input.value;
  if (!raw || !input.checkValidity()) {
    input.reportValidity();
    return;
  }

  clearUI();

  try {
    const q = normalizeQuery(raw);
    const data = await fetchCreature(q);
    fillUI(data);
  } catch (err) {
    alert("Creature not found");
  }
};

// Click handler & submit handler (both trigger search)
button.addEventListener("click", handleSearch);
form.addEventListener("submit", handleSearch);
