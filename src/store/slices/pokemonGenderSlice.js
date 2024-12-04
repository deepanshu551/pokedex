import {createSlice} from "@reduxjs/toolkit";

const pokemonGenderSlice = createSlice({

   name: "genders",
   initialState: {},
   reducers:{
      setGenders: (state,action) =>{
         state.gender = action.payload
      }
   }
});

export const {setGenders} = pokemonGenderSlice.actions;
export default pokemonGenderSlice.reducer;
