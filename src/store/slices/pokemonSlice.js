import {createSlice} from "@reduxjs/toolkit";

const pokemonSlice = createSlice({

   name: "pokemon",
   initialState: {},
   reducers:{
      setPokemons: (state,action) =>{
         state.pokemons = action.payload
      }
   }
});

export const {setPokemons} = pokemonSlice.actions;
export default pokemonSlice.reducer;
