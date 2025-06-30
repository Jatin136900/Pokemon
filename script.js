const section = document.querySelector("section");
const loadMore = document.getElementById("loadMore");
const searchInput = document.getElementById("searchInput");
const selectBox = document.getElementById("selectBox");
const noResultMsg = document.getElementById("noResultMsg");

let offset = 0;
const limit = 20;

async function pokeUrl(url) {
    const response = await fetch(url);
    return await response.json();
}

async function loadPokemons() {
    const api = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
    const data = await pokeUrl(api);

    for (const a of data.results) {
        const obj = await pokeUrl(a.url);
        await createCard(obj);
    }

    offset += limit;

    searchInput.dispatchEvent(new Event("input"));
    selectBox.dispatchEvent(new Event("change"));
}

async function createCard(obj) {
    const height = obj.height;
    const weight = obj.weight;

    const stats = {};
    obj.stats.forEach(stat => {
        stats[stat.stat.name] = stat.base_stat;
    });

    const parent = document.createElement("div");
    parent.classList.add("parent");

    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");

    const image = document.createElement("img");
    image.src = obj.sprites.other.dream_world.front_default || obj.sprites.front_default;
    image.alt = obj.name;

    const name = document.createElement("h1");
    name.textContent = obj.name;

    const type = document.createElement("p");
    type.textContent = obj.types.map(t => t.type.name).join(", ");

    front.append(image, name, type);

    const back = document.createElement("div");
    back.classList.add("back");

    back.innerHTML =
        "<p> Height: " + height + "cm</p>" +
        "<p> Weight: " + weight + "kg</p>" +
        "<p>HP: " + stats.hp + "</p>" +
        "<p>Attack: " + stats.attack + "</p>" +
        "<p>Defense: " + stats.defense + "</p>" +
        "<p>Sp. Attack: " + stats["special-attack"] + "</p>" +
        "<p>Sp. Defense: " + stats["special-defense"] + "</p>" +
        "<p>Speed: " + stats.speed + "</p>";

    card.append(front, back);
    parent.append(card);
    section.appendChild(parent);
}

async function fetchingTypes() {
    const response = await fetch("https://pokeapi.co/api/v2/type/?limit=21");
    const data = await response.json();

    selectBox.innerHTML = '<option value="all types" selected>All types</option>';

    data.results.forEach((typeObj) => {
        const option = document.createElement("option");
        option.value = typeObj.name;
        option.textContent = typeObj.name.charAt(0).toUpperCase() + typeObj.name.slice(1);
        selectBox.appendChild(option);
    });
}
function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = selectBox.value.toLowerCase();
    const cards = document.querySelectorAll(".parent");

    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.querySelector("h1").textContent.toLowerCase();
        const type = card.querySelector("p").textContent.toLowerCase();

        const typeMatch = type.includes(selectedType) || selectedType === "all types";
        const nameMatch = name.includes(searchTerm);

        if (typeMatch && nameMatch) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResultMsg.style.display = visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterCards);
selectBox.addEventListener("change", filterCards);
loadMore.addEventListener("click", loadPokemons);

window.addEventListener("load", () => {
    fetchingTypes();
    loadPokemons();
});
