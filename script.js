const section = document.querySelector("section");
const loadMore = document.getElementById("loadMore");

let offset = 0;
const limit = 20;

async function pokeUrl(url) {
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

async function loadPokemons() {
    const api = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
    const data = await pokeUrl(api);

    for (const a of data.results) {
        const obj = await pokeUrl(a.url);

        const parent = document.createElement("div");
        parent.classList.add("parent");

        const image = document.createElement("img");
        image.src = obj.sprites.other.dream_world.front_default || obj.sprites.front_default;
        image.alt = obj.name;

        const name = document.createElement("h1");
        name.textContent = obj.name;

        const type = document.createElement("p");
        type.textContent = obj.types.map(t => t.type.name).join(", ");

        parent.append(image, name, type);
        section.appendChild(parent);
    }

    offset += limit;
}


window.addEventListener("load", loadPokemons);


loadMore.addEventListener("click", loadPokemons);
