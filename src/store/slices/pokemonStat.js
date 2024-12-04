import {createSlice} from "@reduxjs/toolkit";

const pokemonStatSlice = createSlice({

   name: "pokemon",
   initialState: {},
   reducers:{
      setPokemonsStat: (state,action) =>{
         state.pokemons = action.payload
      }
   }
});

export const {setPokemonsStat} = pokemonStatSlice.actions;
export default pokemonStatSlice.reducer;
