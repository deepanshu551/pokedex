import {createSlice} from "@reduxjs/toolkit";

const filteredPokemonSlice = createSlice({

   name: "pokemons",
   initialState: {},
   reducers:{
      setFilteredPokemons: (state,action) =>{
         state.pokemons = action.payload
      },
      setNextSet:(state,action)=>{
        state.nextSet = action.payload
      },
      setPrevSet:(state,action)=>{
        state.prevSet = action.payload
      }
   }
});

export const {setFilteredPokemons,setNextSet,setPrevSet} = filteredPokemonSlice.actions;
export default filteredPokemonSlice.reducer;
