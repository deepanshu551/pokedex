import {createSlice} from "@reduxjs/toolkit";

const selectedTypesSlice = createSlice({

   name: "selectedTypes",
   initialState: {},
   reducers:{
      selectType: (state,action) =>{
         state.type = [...action.payload]
      }
   }
});

export const {selectType} = selectedTypesSlice.actions;
export default selectedTypesSlice.reducer;
