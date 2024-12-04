import React,{useEffect, useState} from "react";
import "./Home.scss"
import PokemonList from "../../Components/PokemonList/PokemonList";
import Heading from "../../Components/Heading/Heading";
import Tools from "../../Components/Tools/Tools";
import ErrorBoundary from "../../Components/Error/ErrorBoundary";
import Pagination from "../../Components/Pagination/Pagination";
import {useDispatch, useSelector} from "react-redux";
import {setPokemonsStat} from "../../store/slices/pokemonStat";
import axios from "axios";
export default function Home() {
  
  const dispatch=useDispatch();
    const {searchedPokemon} = useSelector(state => state);
    useEffect(()=>{
      document.body.style.padding="43px 75px";
    },[])

 
// useEffect(()=>{
//   async function getPokemonsResponse(){
//     try {
//       const allPokemonsResponse = await axios.get(
//         "https://pokeapi.co/api/v2/pokemon?limit=500" // Fetch all Pokémon
//       );
//       const allPokemons = allPokemonsResponse.data.results;
  
//       // Fetch detailed data for each Pokémon
//       const pokemonDetailsPromises = allPokemons.map((pokemon) =>
//         axios.get(pokemon.url)
//       );
  
//       const detailedResponses = await Promise.all(pokemonDetailsPromises);
  
//       // Extract Pokémon with HP within the desired range
//       const filteredPokemons = detailedResponses
//         .map((response) => {
//           const stats = response.data.stats;
//           const hpStat = stats.find((stat) => stat.stat.name === "hp");
//           const attackStat =  stats.find((stat) => stat.stat.name === "attack");
//           const defenceStat =  stats.find((stat) => stat.stat.name === "defense");
//           const specialAttackStat =  stats.find((stat) => stat.stat.name === "special-attack");
//           const speedStat =  stats.find((stat) => stat.stat.name === "speed");
//           const specialDefenceStat =  stats.find((stat) => stat.stat.name === "special-defense");
//           return {
//             name: response.data.name,
//             data: response.data,
//             hp: hpStat.base_stat,
//             attack: attackStat.base_stat,
//             defence:defenceStat.base_stat,
//             specialAttack:specialAttackStat.base_stat,
//             speed:speedStat.base_stat,
//             specialDefence:specialDefenceStat.base_stat
//           };
//         })
//       console.log(`Pokémon`, filteredPokemons);
//       dispatch(setPokemonsStat(filteredPokemons));
      
//     } catch (error) {
//       console.error("Error fetching Pokémon by HP:", error);
//       return [];
//     }
//   }

//   getPokemonsResponse()
// },[])
    
  return (
    <section className="poke-home">
      <Heading/>
      {/* <RangeSlider/> */}
      <ErrorBoundary><Tools/></ErrorBoundary>
      <div className="poke-home-main">
        <PokemonList/>
      </div>
      {!searchedPokemon.pokemon &&
      <Pagination/>

      }
    </section>
  );
}
