import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSliders,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { searchPokemon } from "../../store/slices/searchedPokemonSlice";
import { setTypes } from "../../store/slices/pokemonTypesSlice";
import { setGenders } from "../../store/slices/pokemonGenderSlice";
import {setFilteredPokemons,setNextSet,setPrevSet} from "../../store/slices/filteredPokemon";
import {setPokemons} from "../../store/slices/pokemonSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import Select from "../../atoms/select/Select";
import "./Tools.scss";
import Accordion from "../../atoms/Accordion/Accordion";
import Loading from "../../atoms/Loading/Loading";

export default function Tools() {
  const dispatch = useDispatch();
  const [typeList, setTypeList] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [genderList, setGenderList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const { selectedTypes, selectedGenders, selectedStat } = useSelector(
    (state) => state
  );
  const [sliderValues, setSliderValues] = useState({});

  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState({
    HP: {
      min: 70,
      max: 150,
    },
    Attack: {
      min: 70,
      max: 150,
    },
    Defense: {
      min: 70,
      max: 150,
    },
    Speed: {
      min: 70,
      max: 150,
    },
    "Sp-Attack": {
      min: 70,
      max: 150,
    },
    "Sp-Def": {
      min: 70,
      max: 150,
    },
  });

  const fetchPokemonBasedOnSearch = async () => {
    if (searchValue) {
      try {
        const pokemon = await axios.get(`/pokemon/${searchValue}`);
        dispatch(searchPokemon(pokemon.data));
        toast.success("Pokémon found!");
      } catch (error) {
        console.error("Error fetching Pokémon:", error.message);
        toast.error("Pokémon not found. Please try again!");
      }
    } else {
      dispatch(searchPokemon(""));
    }
  };

  const openfilterModal = () => {
    setOpenModal(true);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchPokemonBasedOnSearch();
    }
  };

  const closePopup = () => {
    setOpenModal(false);
  };

  useEffect(() => {

    if (window.outerWidth > 720) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
    
    window.addEventListener('resize',()=>{
      if (window.outerWidth > 720) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    })
   
  }, []);
  useEffect(() => {
    async function fetchAlltypes() {
      const res = await axios("/type");
      if (res) {
        dispatch(setTypes(res.data.results));
        setTypeList(res.data.results);
      }
    }
    fetchAlltypes();
  }, []);
  useEffect(() => {
    async function fetchAllGenders() {
      const res = await axios("/gender");
      console.log("gender", res);
      if (res) {
        dispatch(setGenders(res.data.results));
        setGenderList(res.data.results);
      }
    }
    fetchAllGenders();
  }, []);

  const fetchPokemon = async (typeName) => {
    try {
      let newPokemonList;
      if (typeName == "type") {
        const promises = selectedTypes.type.map((type) =>
          axios.get(`${typeName}/${type}`)
        );

        const responses = await Promise.all(promises);

        newPokemonList = responses.flatMap((response) =>
          response.data.pokemon.map((entry) => entry.pokemon)
        );
      } else {
        const promises = selectedGenders.gender.map((type) =>
          axios.get(`${typeName}/${type}`)
        );

        const responses = await Promise.all(promises);
        newPokemonList = responses.flatMap((response) =>
          response.data.pokemon_species_details.map((entry) => {
            return {
              name: entry.pokemon_species.name,
              url: entry.pokemon_species.url.replace(
                "pokemon-species",
                "pokemon"
              ),
            };
          })
        );
      }

      const uniquePokemons = Array.from(
        new Map(
          newPokemonList.map((pokemon) => [
            parseInt(pokemon.url.split("/").slice(-2, -1)[0], 10), // Use numeric ID as the key
            pokemon,
          ])
        ).values()
      );
      uniquePokemons.sort((a, b) => {
        const idA = parseInt(a.url.split("/").slice(-2, -1)[0], 10);
        const idB = parseInt(b.url.split("/").slice(-2, -1)[0], 10);

        return idA - idB;
      });
      return uniquePokemons;

    } catch (error) {
      console.error(`Error fetching Pokémon:`, error.message);
    }
  };

  
    async function getPokemonsResponseStat(sliderValues) {
      const {
        HP,
        Attack,
        Defense,
        Speed,
        "Sp-Attack": SpAttack,
        "Sp-Def": SpDefense,
      } = sliderValues;

      try {
        setLoading(true);
        const allPokemonsResponse = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=10000" // Fetch all Pokémon
        );
        const allPokemons = allPokemonsResponse.data.results;

        // Fetch detailed data for each Pokémon
        const pokemonDetailsPromises = allPokemons.map((pokemon) =>
          axios.get(pokemon.url)
        );

        const detailedResponses = await Promise.all(pokemonDetailsPromises);

        // Extract Pokémon with HP within the desired range
        const filteredPokemons = detailedResponses
          .map((response) => {
            const stats = response.data.stats;
            const hpStat = stats.find((stat) => stat.stat.name === "hp");
            const attackStat = stats.find(
              (stat) => stat.stat.name === "attack"
            );
            const defenseStat = stats.find(
              (stat) => stat.stat.name === "defense"
            );
            const specialAttackStat = stats.find(
              (stat) => stat.stat.name === "special-attack"
            );
            const speedStat = stats.find((stat) => stat.stat.name === "speed");
            const specialDefenseStat = stats.find(
              (stat) => stat.stat.name === "special-defense"
            );
            return {
              name: response.data.name,
              data: response.data,
              url: allPokemons.find(
                (pokemon) => pokemon.name == response.data.name
              ).url,
              hp: hpStat.base_stat,
              attack: attackStat.base_stat,
              defense: defenseStat.base_stat,
              specialAttack: specialAttackStat.base_stat,
              speed: speedStat.base_stat,
              specialDefence: specialDefenseStat.base_stat,
            };
          })
          .filter((pokemon) => pokemon.hp >= HP.min && pokemon.hp <= HP.max)
          .filter(
            (pokemon) =>
              pokemon.attack >= Attack.min && pokemon.attack <= Attack.max
          )
          .filter(
            (pokemon) =>
              pokemon.speed >= Speed.min && pokemon.speed <= Speed.max
          )
          .filter(
            (pokemon) =>
              pokemon.defense >= Defense.min && pokemon.defense <= Defense.max
          )
          .filter(
            (pokemon) =>
              pokemon.specialAttack >= SpAttack.min &&
              pokemon.specialAttack <= SpAttack.max
          )
          .filter(
            (pokemon) =>
              pokemon.specialDefence >= SpDefense.min &&
              pokemon.specialDefence <= SpDefense.max
          );

        console.log(`Pokémon`, filteredPokemons);
        const uniquePokemons = Array.from(
          new Map(
            filteredPokemons.map((pokemon) => [
              parseInt(pokemon.url.split("/").slice(-2, -1)[0], 10), // Use numeric ID as the key
              pokemon,
            ])
          ).values()
        );
        uniquePokemons.sort((a, b) => {
          const idA = parseInt(a.url.split("/").slice(-2, -1)[0], 10);
          const idB = parseInt(b.url.split("/").slice(-2, -1)[0], 10);

          return idA - idB;
        });

setLoading(false)
        return uniquePokemons;
      } catch (error) {
        console.error("Error fetching Pokémon by HP:", error);
        return [];
      }
    }


  const applyFilters = async() => {
    setLoading(true);
    window.scrollTo({
      top: 0, 
      behavior: 'smooth' // Optional: 'smooth' for animated scrolling, 'auto' for instant
    });
    try {
      const pokemonBasedOntype=await fetchPokemon("type");
      const pokemonBasedOnGender=await fetchPokemon("gender");
      const pokemonBasedOnStat=await getPokemonsResponseStat(Object.keys(selectedStat.stat || {}).length === 0 ? defaultValue :selectedStat.stat);
      const pokemonTypeNames = new Set(pokemonBasedOntype.map((pokemon) => pokemon.pokemonName));



      const commonPokemon = pokemonBasedOnGender.filter((pokemon) => pokemonTypeNames.has(pokemon.pokemonName));

      const pokemonTypeName = new Set(commonPokemon.map((pokemon) => pokemon.pokemonName));

      const uniqPokemons = pokemonBasedOnStat.filter((pokemon) => pokemonTypeName.has(pokemon.pokemonName));
      
      const results = {
          results: uniqPokemons.slice(0, 20),
        };

        setLoading(false);
        setOpenModal(false);
        dispatch(setPokemons(results));
        dispatch(setFilteredPokemons(uniqPokemons));
        dispatch(setNextSet(20));
        dispatch(setPrevSet(0));
      
    } catch (err) {
      console.log(err)
    }
  };

  
  return (
    <div className="poke-home-tools">
      <div className="poke-home-tools-item poke-home-tools-search">
        <div className="poke-home-tools-input">
          <label
            htmlFor="search"
            className="poke-home-tools-input-label heading_regular"
          >
            Search by
          </label>
          <input
            type="text"
            placeholder="Name or Number"
            onKeyDown={handleKeyDown}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          <button onClick={fetchPokemonBasedOnSearch}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button>
        </div>
      </div>
      {isMobile && (
        <div className="poke-home-tools-mob-button">
          <button onClick={openfilterModal}>
            <FontAwesomeIcon
              icon={faSliders}
              className="poke-home-tools-mob-icon"
            />
          </button>
        </div>
      )}
      {!isMobile && (
        <div className="poke-home-tools-desktop">
          <div className="poke-home-tools-item poke-home-tools-type">
            <div className="poke-home-tools-input">
              <label
                htmlFor=""
                className="poke-home-tools-input-label heading_regular"
              >
                Type
              </label>
              <Select list={typeList} selectType={"type"} />
            </div>
          </div>
          <div className="poke-home-tools-item poke-home-tools-gender">
            <div className="poke-home-tools-input">
              <label
                htmlFor=""
                className="poke-home-tools-input-label heading_regular"
              >
                Gender
              </label>
              <Select
                list={genderList}
                selectType={"gender"}
                loading={loading}
                setLoading={setLoading}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                sliderValues={sliderValues}
                setSliderValues={setSliderValues}
                defaultValue={defaultValue}
                setDefaultValue={setDefaultValue}
              />
            </div>
          </div>
          <div className="poke-home-tools-item poke-home-tools-stats">
            <div className="poke-home-tools-input">
              <label className="poke-home-tools-input-label heading_regular">
                Stats
              </label>
              <Select
                list={[
                  { name: "HP" },
                  { name: "Attack" },
                  { name: "Defense" },
                  { name: "Speed" },
                  { name: "Sp-Attack" },
                  { name: "Sp-Def" },
                ]}
                selectType={"stat"}
              />
            </div>
          </div>
        </div>
      )}
      {isMobile && openModal && (
        <div className="poke-home-tools-mob">
          {loading && <Loading/> }
          <div className="poke-home-tools-mob-head">
            <div className="poke-home-tools-mob-head-title">Filters</div>
            <div className="poke-home-tools-mob-head-close">
              <FontAwesomeIcon onClick={closePopup} icon={faCircleXmark} />
            </div>
          </div>

          <div className="poke-home-tools-mob-content">
            <div className="poke-home-tools-mob-content-item">
              <Accordion
                list={typeList}
                selectType={"type"}
                setOptions={setSelectedOptions}
              />
            </div>
            <div className="poke-home-tools-mob-content-item">
              <Accordion
                list={genderList}
                selectType={"gender"}
                setOptions={setSelectedOptions}
              />
            </div>
            <div className="poke-home-tools-mob-content-item">
              <Accordion
                list={[
                  { name: "HP" },
                  { name: "Attack" },
                  { name: "Defense" },
                  { name: "Speed" },
                  { name: "Sp-Attack" },
                  { name: "Sp-Def" },
                ]}
                selectType={"stat"}
              />
            </div>
          </div>
          <div className="poke-home-tools-mob-footer">
           
            <button
              onClick={applyFilters}
              className="poke-home-mob-button apply"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
