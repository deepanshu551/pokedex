import {createSlice} from "@reduxjs/toolkit";

const selectedGenderSlice = createSlice({

   name: "selectedGender",
   initialState: {},
   reducers:{
      selectGender: (state,action) =>{
         state.gender = [...action.payload]
      }
   }
});

export const {selectGender} = selectedGenderSlice.actions;
export default selectedGenderSlice.reducer;
