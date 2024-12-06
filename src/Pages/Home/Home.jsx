import React, { useEffect } from "react";
import "./Home.scss";
import PokemonList from "../../Components/PokemonList/PokemonList";
import Heading from "../../Components/Heading/Heading";
import Tools from "../../Components/Tools/Tools";
import ErrorBoundary from "../../Components/Error/ErrorBoundary";
import Pagination from "../../Components/Pagination/Pagination";
import {  useSelector } from "react-redux";
export default function Home() {
  const { searchedPokemon } = useSelector((state) => state);
  useEffect(() => {
    if (window.outerWidth > 720) {
      document.body.style.padding = "43px 75px";
    } else {
      document.body.style.padding = " 63px 28px";
    }

    document.addEventListener("resize",()=>{
      if (window.outerWidth > 720) {
        document.body.style.padding = "43px 75px";
      } else {
        document.body.style.padding = " 63px 28px";
      }
    })
  }, []);

  return (
    <section className="poke-home">
      <Heading />
      <ErrorBoundary>
        <Tools />
      </ErrorBoundary>
      <div className="poke-home-main">
        <PokemonList />
      </div>
      {!searchedPokemon.pokemon && <Pagination />}
    </section>
  );
}
