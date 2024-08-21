const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonDetails = document.getElementById('pokemonDetails');

const maxRecords = 50;
const limit = 10;
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeapi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) =>
            `<li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number"> ${pokemon.number}</span>
                <span class="name"> ${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}"> ${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>`
        ).join('');
        pokemonList.innerHTML += newHtml;
    });
}

function showPokemonDetails(pokemon) {
    const { name, number, types, photo, stats } = pokemon;
    const typeClass = types[0]; // Pega o primeiro tipo como classe
    const statsHtml = stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('');
    
    pokemonDetails.innerHTML = `
        <div class="pokemon-details ${typeClass}">
        <span class="pokemon-number">#${number}</span>
            <h2 class="pokemon-name">${name}</h2>
            <div class="pokemon-types">
                ${types.map(type => `<span class="type ${type}">${type}</span>`).join('')}
            </div>
            <img src="${photo}" alt="${name}">
            <ul class="pokemon-stats">
                ${statsHtml}
            </ul>
        </div>
    `;
    pokemonDetails.style.display = 'block';

    loadMoreButton.parentElement.appendChild(loadMoreButton);
}




pokemonList.addEventListener('click', (event) => {
    const li = event.target.closest('li.pokemon');
    if (li) {
        const pokemonId = li.getAttribute('data-id');
        pokeapi.getPokemonById(pokemonId).then(pokemonDetails => {
            showPokemonDetails(pokemonDetails);
        });
    }
});

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qntRecordNextPage = offset + limit;
    if (qntRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

// carregar mais pokemons
loadPokemonItens(offset, limit);
