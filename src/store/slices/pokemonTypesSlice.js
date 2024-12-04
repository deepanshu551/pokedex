import {createSlice} from "@reduxjs/toolkit";

const pokemonTypesSlice = createSlice({

   name: "types",
   initialState: {},
   reducers:{
      setTypes: (state,action) =>{
         state.types = action.payload
      }
   }
});

export const {setTypes} = pokemonTypesSlice.actions;
export default pokemonTypesSlice.reducer;
