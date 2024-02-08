import { createSlice } from "@reduxjs/toolkit";

const initialState ={excelData : {} }
const excelSlice =createSlice({
    name : 'excel',
    initialState,
    reducers :{
        add(state , action){
            state.excelData = action.payload
        },
       
    }
})

export const excelAction = excelSlice.actions
export default excelSlice.reducer