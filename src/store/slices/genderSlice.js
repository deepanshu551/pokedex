import {createSlice} from "@reduxjs/toolkit";

const genderListSlice = createSlice({

   name: "genderList",
   initialState: {},
   reducers:{
      setGenderList: (state,action) =>{
         state.genderList = {...state.genderList,...action.payload}
      }
   }
});

export const {setGenderList} = genderListSlice.actions;
export default genderListSlice.reducer;
