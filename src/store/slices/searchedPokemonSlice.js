import {createSlice} from "@reduxjs/toolkit";

const searchedPokemonSlice = createSlice({

   name: "searchedPokemon",
   initialState: {},
   reducers:{
      searchPokemon: (state,action) =>{
         state.pokemon = action.payload
      }
   }
});

export const {searchPokemon} = searchedPokemonSlice.actions;
export default searchedPokemonSlice.reducer;
