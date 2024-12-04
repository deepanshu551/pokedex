import {createSlice} from "@reduxjs/toolkit";

const selectedPokemonSlice = createSlice({

   name: "selectedPokemon",
   initialState: {},
   reducers:{
      selectPokemon: (state,action) =>{
         state.pokemon = action.payload
      }
   }
});

export const {selectPokemon} = selectedPokemonSlice.actions;
export default selectedPokemonSlice.reducer;
