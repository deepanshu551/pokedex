import React, { useState, useEffect } from "react";
import styles from "../../styles/typeColor.scss";
import "./PokeCard.scss";
import { useDispatch } from "react-redux";
import { selectPokemon } from "../../store/slices/selectedPokemonSlice";
import { useNavigate } from "react-router-dom";
const pokemonCache = {};
export default function PokeCard({ pokemon }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [colors, setColor] = useState([]);
  const [pokeImage, setPokeImage] = useState("");
  const [pokeId, setPokeId] = useState("");

  const handleSelectPokemon = (url) => {
    console.log("yesin");
    if (pokemonCache[url]) {
      dispatch(selectPokemon(pokemonCache[url]));
      navigate("/details");
    }
    else{
        dispatch(selectPokemon(pokemon));
        navigate("/details")
    }
  };
  useEffect(() => {
    async function fetchPokemonDetails() {
      if (!pokemonCache[pokemon.url]) {
        try {
          const result = await fetch(pokemon.url);
          const res = await result.json();
          pokemonCache[pokemon.url] = res;
          const typeNames =
            res && res.types.map((item) => styles[item.type.name]);
          setColor(typeNames);
          res && setPokeImage(res.sprites.other.dream_world.front_default);
          res && setPokeId(res.id.toString().padStart(3, "0"));
        } catch (error) {
          console.error("Error fetching Pokémon details:", error.message);
        }
      } else {
        const res = pokemonCache[pokemon.url];
        const typeNames =
          res && res.types.map((item) => styles[item.type.name]);
        setColor(typeNames);
        res && setPokeImage(res.sprites.other.dream_world.front_default);
        res && setPokeId(res.id.toString().padStart(3, "0"));
      }
    }
    function setData() {
      const typeNames = pokemon.types.map((item) => styles[item.type.name]);
      setColor(typeNames);
      setPokeImage(pokemon.sprites.other.dream_world.front_default);
      setPokeId(pokemon.id.toString().padStart(3, "0"));
    }

    pokemon.sprites ? setData() : fetchPokemonDetails();
  }, [pokemon]);

  const backgroundStyle =
    colors.length > 1
      ? `linear-gradient(to bottom, ${colors.join(", ")})`
      : colors.join("");
  return (
    <div
      className="poke-card-container"
      onClick={() => handleSelectPokemon(pokemon.url)}
      style={{ background: backgroundStyle }}
    >
      <img src={pokeImage} className="poke-card-image" />
      <div className="poke-card-desc">
        <span className="heading_semi_bold_capitalize">{pokemon.name}</span>
        <span className="heading_light">{pokeId}</span>
      </div>
    </div>
  );
}
