import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {searchPokemon} from "../../store/slices/searchedPokemonSlice";
import {setTypes} from "../../store/slices/pokemonTypesSlice";
import {setGenders} from "../../store/slices/pokemonGenderSlice";
import { toast } from "react-toastify";
import {useDispatch,useSelector} from "react-redux";
import axios from "../../utils/axios";
import Select from "../../atoms/select/Select";
import "./Tools.scss";

export default function Tools() {
    const dispatch = useDispatch();
    const [typeList,setTypeList] =useState([]);
    const [genderList,setGenderList] =useState([]);

    const [searchValue,setSearchValue] = useState("");
    const fetchPokemonBasedOnSearch =  async () => {
        if(searchValue){
            try {
                const pokemon = await axios.get(`/pokemon/${searchValue}`);
            dispatch(searchPokemon(pokemon.data));
            toast.success("Pokémon found!");
            } catch (error) {
                console.error("Error fetching Pokémon:", error.message);
            toast.error("Pokémon not found. Please try again!");
            }
        }
        else{
        dispatch(searchPokemon(''));
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchPokemonBasedOnSearch();
        }
    };

    useEffect(()=>{
      async function fetchAlltypes(){
        const res = await axios("/type");
        if(res){
          dispatch(setTypes(res.data.results));
          setTypeList(res.data.results);
        }  
      } 
      fetchAlltypes();

    },[])
    useEffect(()=>{
      async function fetchAllGenders(){
        const res = await axios("/gender");
        console.log("gender",res)
        if(res){
          dispatch(setTypes(res.data.results));
          setGenderList(res.data.results);
        }  
      } 
      fetchAllGenders();

    },[])


    
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
          <input type="text" placeholder="Name or Number" onKeyDown={handleKeyDown} value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}}/>
          <button onClick={fetchPokemonBasedOnSearch}><FontAwesomeIcon icon={faSearch} className="search-icon" /></button>
        </div>
      </div>
      <div className="poke-home-tools-mob">
        <div className="poke-home-tools-item poke-home-tools-type">
          <div className="poke-home-tools-input">
            <label
              htmlFor=""
              className="poke-home-tools-input-label heading_regular"
            >
              Type
            </label>
            <Select list={typeList} selectType={"type"}/>
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
            <Select list={genderList} selectType={"gender"}/>
          </div>
        </div>
        <div className="poke-home-tools-item poke-home-tools-stats">
          <div className="poke-home-tools-input">
            <label className="poke-home-tools-input-label heading_regular">
              Stats
            </label>
            <Select list={[{name:"HP"},{name:"Attack"},{name:"Defense"},{name:"Speed"},{name:"Sp-Attack"},{name:"Sp-Def"}]} selectType={"stat"}/>
          </div>
        </div>
      </div>
    </div>
  );
}
