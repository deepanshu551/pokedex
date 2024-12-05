import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Accordion.scss";
import axios from "../../utils/axios";
import {selectType as typeSelect} from "../../store/slices/selectedTypesSlice";
import {selectGender} from "../../store/slices/selectedGendersSlice";
import {selectStat} from "../../store/slices/selectedStatSlice";

import RangeSlider from "../RangeSlider/RangeSlider";
import {useDispatch} from "react-redux";
import {
  faChevronDown,
  faCirclePlus,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";

import { setPokemons } from "../../store/slices/pokemonSlice";
import {
  setFilteredPokemons,
  setNextSet,
  setPrevSet,
} from "../../store/slices/filteredPokemon";




export default function Accordion({ list, selectType }) {

    const [openAccordion,setOpenAccordion] = useState(false);
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

  useEffect(()=>{
    if(selectType == 'type'){
    dispatch(typeSelect(selectedOptions));
    }
    if(selectType == 'gender'){
        dispatch(selectGender(selectedOptions));

    }
  },[selectedOptions])

  useEffect(()=>{
    if(selectType=='stat'){
        dispatch(selectStat(sliderValues))
    }
  },[sliderValues])
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


  const selectOptionShow =
    selectedOptions ? selectedOptions.length > 1
      ? `(${selectedOptions[0]} <span class="heading_bolder_small">+ ${
          selectedOptions.length - 1
        } More</span>)`
      : `${selectedOptions[0]}`: 0;

    const handleOpenAccordion = () => {
        if(openAccordion== true){
            console.log(selectedOptions)
        }
        setOpenAccordion(prev=>{
            return !prev
        })
    }
 
     


  return (
    <div className="accordion-container">
      <div className={`accordion-head-container ${selectType}`}>
        <div className="accordion-head">
          <div className="accordion-head-title">{selectType}</div>
          <div className="accordion-head-types"  dangerouslySetInnerHTML={{ __html: selectOptionShow }}></div>

          <div className="accordion-head-icon">
            <button onClick={handleOpenAccordion}>
              {!openAccordion ? <FontAwesomeIcon icon={faCirclePlus} /> :<FontAwesomeIcon icon={faCircleMinus} /> }
            </button>
          </div>
        </div>
       {openAccordion && <div className="accordion-head-list"> {list.map((option, index) => {
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
                  value={option.name}
                  checked={selectedOptions.includes(option.name)}
                  onChange={handleChange}
                />
                <label htmlFor={option.name}>{option.name}</label>
              </div>
            );
          }
        })}</div>}
      </div>
      
    </div>
  );
}
