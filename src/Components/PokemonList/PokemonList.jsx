import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import PokeCard from "../PokeCard/PokeCard";
import ErrorBoundary from "../Error/ErrorBoundary";
import { useSelector, useDispatch } from "react-redux";
import { setPokemons } from "../../store/slices/pokemonSlice";
import { setGenderList } from "../../store/slices/genderSlice";

import "./PokemonList.scss";
export default function PokemonList() {
  const dispatch = useDispatch();
  const { searchedPokemon, pokemon } = useSelector((state) => state);

  const [pokeList, setPokeList] = useState([]);

  useEffect(() => {
    async function fetchPokemons() {
      const pokemons = await axios.get("/pokemon");
      setPokeList(pokemons.data.results);
      dispatch(setPokemons(pokemons.data));
    }

    searchedPokemon.pokemon
      ? setPokeList([searchedPokemon.pokemon])
      : fetchPokemons();
  }, [searchedPokemon]);

  useEffect(() => {
    if (pokemon.pokemons) {
      setPokeList(pokemon.pokemons.results);
    }
  }, [pokemon.pokemons]);

  useEffect(() => {
    async function fetchPokemonGenders() {
      const genderFemale = await axios("/gender/1");
      const genderF = genderFemale.data.pokemon_species_details.map(
        (item) => item.pokemon_species.name
      );
      dispatch(setGenderList({ female: genderF }));
      const genderMale = await axios("/gender/2");
      const genderM = genderMale.data.pokemon_species_details.map(
        (item) => item.pokemon_species.name
      );
      dispatch(setGenderList({ male: genderM }));
      const genderUnKnown = await axios("/gender/3");
      const genderU = genderUnKnown.data.pokemon_species_details.map(
        (item) => item.pokemon_species.name
      );
      dispatch(setGenderList({ genderless: genderU }));
    }
    fetchPokemonGenders();
  }, []);

  return (
    <ErrorBoundary>
      <div className="poke-list">
        {pokeList.map((pokemon) => {
          return <PokeCard key={pokemon.name} pokemon={pokemon} />;
        })}
      </div>
    </ErrorBoundary>
  );
}
