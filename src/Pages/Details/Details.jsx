import React, { useEffect, useRef, useState } from "react";
import PokeCard from "../../Components/PokeCard/PokeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Progressbar from "../../atoms/Progressbar/Progressbar";
import styles from "../../styles/typeColor.scss";
import { useSelector, useDispatch } from "react-redux";
import { selectPokemon } from "../../store/slices/selectedPokemonSlice";
import { useNavigate } from "react-router-dom";

import {
  faCircleXmark,
  faCircleArrowLeft,
  faCircleArrowRight,
  faXmark,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import "./Details.scss";
import axios from "../../utils/axios";
export default function Details() {
  const { selectedPokemon, genderList, pokemon } = useSelector((state) => state);

  const [isMobile, setIsMobile] = useState(false);
  const [nextPokemon,setNextPokemon] = useState("");
  const [prevPokemon,setPrevPokemon] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [totalDesc, setTotaldDesc] = useState("");
  const [description, setDescription] = useState("");
  const [genders, setGenders] = useState("");
  const [egg, setEgg] = useState("");
  const [abilities, setAbilities] = useState("");
  const [types, setTypes] = useState([]);
  const [weakness, setWeakness] = useState([]);
  const [evoDetails, setEvoDetails] = useState([]);
  const dispatch = useDispatch();

  const descriptionRef = useRef();
  console.log(selectedPokemon);

  const getFlavorTextString = (entries, targetLanguage, limit = 10) => {
    const uniqueTexts = new Set();

    // Filter entries based on target language and add the flavor_text to the Set
    entries
      .filter((entry) => entry.language.name === targetLanguage)
      .forEach((entry) => {
        const cleanedText = entry.flavor_text.replace(/[\n\f]/g, " "); // Clean escape sequences
        uniqueTexts.add(cleanedText); // Set will automatically handle uniqueness
      });

    // Convert Set back to an array and limit the results to 'limit' items
    const uniqueArray = Array.from(uniqueTexts).slice(0, limit);

    // Join the unique flavor_texts into a single string
    return uniqueArray.join(" ");
  };

  useEffect(() => {
    async function fetchDescription() {
      try {
        const res = await axios(
          `/pokemon-species/${selectedPokemon.pokemon.id}`
        );
        const groupedByLanguage = getFlavorTextString(
          res.data.flavor_text_entries,
          "en",
          10
        );
        setTotaldDesc(groupedByLanguage);
        

        const pokemonSpecis = await axios(
          `pokemon-species/${selectedPokemon.pokemon.id}`
        );
        console.log("pokemonspecis", pokemonSpecis);
        const evolutionRes = await fetch(
          `${pokemonSpecis.data.evolution_chain.url}`
        );
        const evolutionChain = await evolutionRes.json();
        console.log("evolutionchain", evolutionChain.chain);
        const mm = getSpeciesUrls(evolutionChain.chain);
        const pokemondetails = await fetchPokemonDetailsParallel(mm);
        console.log("pokeeek", pokemondetails);
        setEvoDetails(pokemondetails);

        const eggs = pokemonSpecis.data.egg_groups;
        setEgg(eggs.map((egg) => egg.name).join(", "));

        const pokeWeakness = await axios(`type/${selectedPokemon.pokemon.id}`);
        console.log("pokeweak", pokeWeakness);
        setWeakness(
          pokeWeakness.data.damage_relations.double_damage_from.map(
            (weakness) => weakness.name
          )
        );
      } catch (error) {
        console.log("not able to find details", error);
      }
    }
    fetchDescription();
  }, [selectedPokemon]);

  useEffect(() => {
    const updateBodyPadding = () => {
      console.log("Current width:", window.outerWidth);
      if (window.outerWidth > 720) {
        setIsMobile(false);
        document.body.style.paddingLeft = "368px";
        document.body.style.paddingRight = "368px";
        console.log("totladesc720",totalDesc)
        if (totalDesc.length > 450) {
          let descCroppred = totalDesc.slice(0, 450);
          setDescription(descCroppred);
        }
      } else {
        setIsMobile(true);
        document.body.style.paddingLeft = "33px";
        document.body.style.paddingRight = "33px";
        console.log("totladesc",totalDesc)
        if (totalDesc.length > 80) {
          let descCroppred = totalDesc.slice(0, 80);
          setDescription(descCroppred);
        }
      }
    };

    updateBodyPadding();

    window.addEventListener("resize", updateBodyPadding);

    return () => {
      window.removeEventListener("resize", updateBodyPadding);
    };
  }, [totalDesc]);


  useEffect(() => {
    let gendersList = [];
    if (genderList.genderList.male.includes(selectedPokemon.pokemon.name)) {
      gendersList.push("Male");
    }
    if (genderList.genderList.female.includes(selectedPokemon.pokemon.name)) {
      gendersList.push("Female");
    }
    if (
      genderList.genderList.genderless.includes(selectedPokemon.pokemon.name)
    ) {
      gendersList.push("Unknow");
    }
    setGenders(gendersList.join(", "));

    setAbilities(
      selectedPokemon.pokemon.abilities
        .map((ability) => ability.ability.name)
        .join(", ")
    );
    setTypes(selectedPokemon.pokemon.types.map((type) => type.type.name));
  }, [selectedPokemon]);

 
  useEffect(()=>{
    console.log("pokemon in details",pokemon.pokemons.results);
    function findBeforeAndAfter(pokemonList, targetName) {
      // Find the index of the target Pokémon based on its name
      const index = pokemonList.findIndex(pokemon => pokemon.name === targetName);
  
      if (index === -1) {
          // Pokémon not found
          return { before: null, after: null };
      }
  
      // Get the Pokémon before and after the target
      const before = index > 0 ? pokemonList[index - 1] : null;
      const after = index < pokemonList.length - 1 ? pokemonList[index + 1] : null;
  
      return { before, after };
  }
  const result = findBeforeAndAfter(pokemon.pokemons.results, selectedPokemon.pokemon.name);
  setNextPokemon(result.after);
  setPrevPokemon(result.before);

  },[selectedPokemon])


  const onNext = async () => {
    const newPokemon = await axios(`pokemon/${selectedPokemon.pokemon.id + 1}`);
    dispatch(selectPokemon(newPokemon.data));
  };

  const onPrev = async () => {
    const newPokemon = await axios(`pokemon/${selectedPokemon.pokemon.id - 1}`);
    dispatch(selectPokemon(newPokemon.data));
  };

  const onPreviousClick = async()=>{
    const newPokemon = await axios(`pokemon/${prevPokemon.name}`);
    dispatch(selectPokemon(newPokemon.data));

  }

  const onNextClick = async()=>{
    const newPokemon = await axios(`pokemon/${nextPokemon.name}`);
    dispatch(selectPokemon(newPokemon.data));
  }
  async function fetchPokemonDetailsParallel(speciesUrls) {
    const promises = speciesUrls.map(async (url) => {
      const id = extractIdFromUrl(url);
      if (id) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${id}/`
        );
        const data = await response.json();
        return { id, data };
      }
    });

    const results = await Promise.all(promises);
    return results;
  }

  function extractIdFromUrl(url) {
    const match = url.match(/\/pokemon-species\/(\d+)\//);
    return match ? match[1] : null;
  }

  function getSpeciesUrls(obj) {
    const speciesUrls = [];

    function traverse(node) {
      if (node.species && node.species.url) {
        speciesUrls.push(node.species.url);
      }
      if (node.evolves_to && Array.isArray(node.evolves_to)) {
        node.evolves_to.forEach(traverse);
      }
    }

    traverse(obj);
    return speciesUrls;
  }
  const openDesc = () => {
    setShowModal((prev) => {
      return !prev;
    });
    if (showModal) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  function formatString(input) {
    if (input.includes("-")) {
      const parts = input.split("-"); // Split at the hyphen
      const firstPart = parts[0].slice(0, 2); // Capitalize first word

      return `${firstPart}. ${parts[1]}`; // Return transformed string
    } else {
      return input.charAt(0).toUpperCase() + input.slice(1); // Capitalize if no hyphen
    }
  }

  function decimetersToFeetInches(dm) {
    const totalInches = dm * 3.937; // Convert to inches
    const feet = Math.floor(totalInches / 12); // Get the whole feet
    const inches = (totalInches % 12).toFixed(2); // Get the remaining inches (rounded to 2 decimal places)

    return `${feet}' ${Math.ceil(inches)}''`;
  }

  const goToHome = () => {
    navigate("/");
  };
  return (
    <section className="poke-details">
      <div className="poke-details-desc">
        <div className="poke-details-img">
          <PokeCard
            key={selectedPokemon.pokemon && selectedPokemon.pokemon.id}
            pokemon={selectedPokemon.pokemon && selectedPokemon.pokemon}
          />
        </div>
        <div className="poke-details-title">
          <div className="poke-details-name heading_super_bold">
            {selectedPokemon.pokemon && selectedPokemon.pokemon.name}
          </div>
          <div className="poke-details-divider"></div>
          <div className="poke-details-id">
            {selectedPokemon.pokemon &&
              selectedPokemon.pokemon.id.toString().padStart(3, "0")}
          </div>
          <div className="poke-details-divider"></div>
          <div className="poke-navigation">
            <FontAwesomeIcon
              className="poke-icon left"
              onClick={onPrev}
              icon={faCircleArrowLeft}
            />
            <FontAwesomeIcon
              className="poke-icon close"
              onClick={goToHome}
              icon={faCircleXmark}
            />
            <FontAwesomeIcon
              className="poke-icon right"
              onClick={onNext}
              icon={faCircleArrowRight}
            />
          </div>
        </div>
        <div className={`poke-details-description`} ref={descriptionRef}>
          {description + ". . ."}

          <button className="poke-show-more">
            <span onClick={openDesc}>read more</span>
          </button>
        </div>
      </div>

      <div className="poke-details-data">
        <div className="poke-details-data-container">
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">height</span>
            <span className="poke-details-data-value">
              {selectedPokemon.pokemon &&
                decimetersToFeetInches(selectedPokemon.pokemon.height)}
            </span>
          </div>
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">weight</span>
            <span className="poke-details-data-value">
              {selectedPokemon.pokemon && selectedPokemon.pokemon.weight / 10}{" "}
              kg
            </span>
          </div>
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">gender</span>
            <div>
              <span className="poke-details-data-value">{genders}</span>
            </div>
          </div>
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">Egg group</span>
            <div>
              <span className="poke-details-data-value">{egg}</span>
            </div>
          </div>
        </div>
        <div className="poke-details-data-container">
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">abilities</span>
            <span className="poke-details-data-value">{abilities}</span>
          </div>
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">types</span>
            <div className="poke-types">
              {types.map((type) => {
                return (
                  <span
                    style={{ backgroundColor: styles[type] }}
                    className="poke-details-data-value poke-type"
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="poke-details-data-items">
            <span className="poke-details-data-heading">weakness</span>
            <div className="poke-types">
              {weakness.map((weak) => {
                return (
                  <span
                    style={{ backgroundColor: styles[weak] }}
                    className="poke-details-data-value poke-type"
                  >
                    {weak}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="poke-details-stats">
        <div className="poke-details-stat-container">
          <span className="poke-details-stat-heading">Stats</span>
          <div className="poke-details-stat-items">
            {selectedPokemon.pokemon.stats.map((stat) => {
              return (
                <Progressbar
                  stat={formatString(stat.stat.name)}
                  value={stat.base_stat}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="poke-details-evolution">
        <div className="poke-details-evolution-heading">Evolution Chain</div>
        <div className="poke-details-evolution-container">
          {evoDetails.map((poke, index) => (
            <>
              <PokeCard pokemon={poke.data} key={poke.data.name} />
              {index < evoDetails.length - 1 && <div className="arrow">→</div>}
            </>
          ))}
        </div>
      </div>
      <div className={`overlay ${showModal ? "show-overlay" : ""}`}></div>
      <div className={`desc-modal ${showModal ? "show-modal" : ""}`}>
        {totalDesc}
        <FontAwesomeIcon
          className="close-icon"
          onClick={openDesc}
          icon={faXmark}
        />
      </div>
      <div className={`poke-navigation-mobile ${isMobile ? "show" : ""}`}>
        {prevPokemon && <button onClick={onPreviousClick} className="poke-navigation-mobile-button"><FontAwesomeIcon icon={faArrowLeft}/> <span>{prevPokemon.name}</span> </button>}
        {nextPokemon && <button onClick={onNextClick} className="poke-navigation-mobile-button"> <span>{nextPokemon.name}</span> <FontAwesomeIcon icon={faArrowRight}/></button>}
      </div>
    </section>
  );
}
