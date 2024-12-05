import React, { useState, useEffect } from "react";
import "./Select.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../utils/axios";
import {
  faChevronDown,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { setPokemons } from "../../store/slices/pokemonSlice";
import {
  setFilteredPokemons,
  setNextSet,
  setPrevSet,
} from "../../store/slices/filteredPokemon";
import { useDispatch } from "react-redux";
import RangeSlider from "../RangeSlider/RangeSlider";
import Loading from "../Loading/Loading";
export default function Select({ list, selectType }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [open, setOpen] = useState(false);
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectType !== "stat") {
      setSelectedOptions(list.map((option) => option.name));
    }
  }, [list, selectType]);

  useEffect(() => {
    setSelectedOptions(list.map((option) => option.name));
  }, [list]);

  const reset = () => {
    if (selectType === "stat") {
      setSliderValues(defaultValue);
    }
  };

  const save = () => {
    async function getPokemonsResponse(sliderValues) {
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
        const results = {
          results: uniquePokemons.slice(0, 20),
        };

        setLoading(false);
        dispatch(setPokemons(results));
        dispatch(setFilteredPokemons(uniquePokemons));
        dispatch(setNextSet(20));
        dispatch(setPrevSet(0));
        setOpen(false);
      } catch (error) {
        console.error("Error fetching Pokémon by HP:", error);
        return [];
      }
    }

    getPokemonsResponse(sliderValues);
  };

  const handleRangeChange = (stat, values) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [stat]: values,
    }));
  };
  const handleChange = (event) => {
    const { value, checked } = event.target;
    setSelectedOptions((prevState) => {
      if (checked) {
        return [...prevState, value]; // Add the option if checked
      } else {
        return prevState.filter((option) => option !== value); // Remove it if unchecked
      }
    });
  };

  useEffect(() => {
    if (selectType !== "stat") {
      if (!open && selectedOptions.length <= list.length) {
        fetchPokemon();
      }
    }
  }, [open, selectedOptions]);

  const fetchPokemon = async () => {
    try {
      const query = selectedOptions;
      const promises = query.map((type) => axios.get(`${selectType}/${type}`));
      const responses = await Promise.all(promises);
      let newPokemonList;
      if (selectType == "type") {
        newPokemonList = responses.flatMap((response) =>
          response.data.pokemon.map((entry) => entry.pokemon)
        );
      } else {
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
      const results = {
        results: uniquePokemons.slice(0, 20),
      };
      if (query.length != 0) {
        dispatch(setPokemons(results));
        dispatch(setFilteredPokemons(uniquePokemons));
        dispatch(setNextSet(20));
        dispatch(setPrevSet(0));
      }

      // Handle the response (e.g., update the Pokémon list in the parent component or global state)
    } catch (error) {
      console.error(
        `Error fetching Pokémon based on ${selectType}:`,
        error.message
      );
    }
  };

  const closeModal = () => {
    setOpen(false);
  };
  const openDropDown = (event) => {
    setOpen((prevValue) => {
      return !prevValue;
    });
  };
  const selectOptionShow =
    selectedOptions.length > 1
      ? `${selectedOptions[0]} <span class="heading_bolder_small">+ ${
          selectedOptions.length - 1
        } More</span>`
      : `${selectedOptions[0]}`;

  return (
    <div className={`checkbox-container ${selectType == "stat" && "stat"}`}>
      <div
      data-testid="checkbox"
        className={`checkbox-select ${open ? "opened" : "closed"}`}
        onClick={openDropDown}
      >
        <div className="selected-values">
          <div
            dangerouslySetInnerHTML={{ __html: selectOptionShow }}
            className="heading_light"
          ></div>
          <FontAwesomeIcon icon={faChevronDown} className="select-chevron" />
        </div>
      </div>
      <div className={`dropdown ${open ? "open-dropdown" : "close-dropdown"}`}>
        <div className="dropdown-heading">
          <span>Select Stats</span>
          <FontAwesomeIcon onClick={closeModal} icon={faCircleXmark} />
        </div>
        {loading && <Loading />}
        {list.map((option, index) => {
          if (selectType == "stat") {
            return (
              <div key={index} className="dropdown-option">
                <label>
                  {option.name.includes("-")
                    ? option.name.split("-").join(".")
                    : option.name}
                </label>
                <RangeSlider
                  sliderId={option.name}
                  defaultValues={sliderValues[option.name]}
                  onRangeChange={(values) =>
                    handleRangeChange(option.name, values)
                  }
                />
              </div>
            );
          } else {
            return (
              <div key={index} className="dropdown-option">
                <input
                  type="checkbox"
                  id={option.name}
                  name={option.name}
                  value={option.name}
                  aria-labelledby={option.name}
                  checked={selectedOptions.includes(option.name)}
                  onChange={handleChange}
                  data-testId={`checkbox-${option.name}`}
                />
                <label  id={option.name}>{option.name}</label>
              </div>
            );
          }
        })}
        <div className="dropdown-buttons">
          <button data-testid="reset" onClick={reset} className="reset">
            reset
          </button>
          <button data-testid="save" onClick={save} className="save">
            save
          </button>
        </div>
      </div>
    </div>
  );
}
