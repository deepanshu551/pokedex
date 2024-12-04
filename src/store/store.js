import {configureStore} from "@reduxjs/toolkit";
import pokemonSlice from "./slices/pokemonSlice";
import searchedPokemonSlice from "./slices/searchedPokemonSlice";
import selectedPokemonSlice from "./slices/selectedPokemonSlice";
import pokemonTypesSlice from "./slices/pokemonTypesSlice";
import pokemonGenderSlice from "./slices/pokemonGenderSlice";
import genderListSlice from "./slices/genderSlice";
import filteredPokemonSilde from "./slices/filteredPokemon";
import pokemonStatSlice from "./slices/pokemonStat";

const store = configureStore({
    reducer:{
        pokemon: pokemonSlice,
        searchedPokemon: searchedPokemonSlice,
        types: pokemonTypesSlice,
        genders:pokemonGenderSlice,
        selectedPokemon:selectedPokemonSlice,
        genderList:genderListSlice,
        filteredList:filteredPokemonSilde,
        pokemons:pokemonStatSlice
    }
});

export default store;