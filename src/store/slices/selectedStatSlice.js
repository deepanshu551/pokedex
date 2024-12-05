import {createSlice} from "@reduxjs/toolkit";

const selectedStatSlice = createSlice({

   name: "selectedState",
   initialState: {},
   reducers:{
      selectStat: (state,action) =>{
         state.stat = action.payload
      }
   }
});

export const {selectStat} = selectedStatSlice.actions;
export default selectedStatSlice.reducer;
