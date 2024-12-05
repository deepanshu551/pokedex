import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPokemons } from "../../store/slices/pokemonSlice";
import { setNextSet, setPrevSet } from "../../store/slices/filteredPokemon";
import "./Pagination.scss";

export default function Pagination() {
  const dispatch = useDispatch();
  const { pokemon } = useSelector((state) => state);
  const [disableNext, setDisableNext] = useState(false);
  const [disablePrev, setDisablePrev] = useState(false);
  const { filteredList } = useSelector((state) => state);

  useEffect(() => {
    if (pokemon.pokemons) {
      setDisablePrev(pokemon.pokemons.previous === null);
      setDisableNext(pokemon.pokemons.next === null);
    }

    if (filteredList.pokemons && filteredList.prevSet == 0) {
      setDisablePrev(true);
    }
  }, [pokemon.pokemons]);
  const next = async () => {
    if (filteredList.pokemons) {
      const newPokemons = filteredList.pokemons.slice(
        filteredList.nextSet,
        filteredList.nextSet + 20
      );
      dispatch(setPokemons({ results: newPokemons }));
      dispatch(setNextSet(filteredList.nextSet + 20));
      dispatch(setPrevSet(filteredList.nextSet));
    } else {
      const res = pokemon.pokemons.next && (await fetch(pokemon.pokemons.next));
      if (res) {
        const newPokemons = await res.json();
        dispatch(setPokemons(newPokemons));
        if (newPokemons.previous) {
          setDisablePrev(false);
        } else {
          setDisablePrev(true);
        }
      }
    }
  };

  const prev = async () => {
    if (filteredList.pokemons) {
      const newPokemons = filteredList.pokemons.slice(
        filteredList.prevSet - 20,
        filteredList.prevSet
      );
      dispatch(setPokemons({ results: newPokemons }));
      dispatch(setNextSet(filteredList.prevSet));
      dispatch(setPrevSet(filteredList.prevSet - 20));
    } else {
      const res =
        pokemon.pokemons.previous && (await fetch(pokemon.pokemons.previous));
      if (res) {
        const newPokemons = await res.json();
        dispatch(setPokemons(newPokemons));
        if (newPokemons.next) {
          setDisableNext(false);
        } else {
          setDisableNext(true);
        }
      }
    }
  };
  return (
    <div className="button-container">
      <button class="button previous" data-testid="prev" onClick={prev} disabled={disablePrev}>
        previous
      </button>
      <button class="button next" data-testid="next" onClick={next} disabled={disableNext}>
        next
      </button>
    </div>
  );
}
