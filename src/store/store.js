import {configureStore} from "@reduxjs/toolkit";
import pokemonSlice from "./slices/pokemonSlice";
import searchedPokemonSlice from "./slices/searchedPokemonSlice";
import selectedPokemonSlice from "./slices/selectedPokemonSlice";
import pokemonTypesSlice from "./slices/pokemonTypesSlice";
import pokemonGenderSlice from "./slices/pokemonGenderSlice";
import genderListSlice from "./slices/genderSlice";
import filteredPokemonSilde from "./slices/filteredPokemon";
import pokemonStatSlice from "./slices/pokemonStat";
import selectedTypesSlice from "./slices/selectedTypesSlice";
import selectedGendersSlice from "./slices/selectedGendersSlice";
import selectedStatSlice from "./slices/selectedStatSlice";

const store = configureStore({
    reducer:{
        pokemon: pokemonSlice,
        searchedPokemon: searchedPokemonSlice,
        types: pokemonTypesSlice,
        genders:pokemonGenderSlice,
        selectedPokemon:selectedPokemonSlice,
        genderList:genderListSlice,
        filteredList:filteredPokemonSilde,
        pokemons:pokemonStatSlice,
        selectedTypes:selectedTypesSlice,
        selectedGenders:selectedGendersSlice,
        selectedStat:selectedStatSlice
    }
});

export default store;