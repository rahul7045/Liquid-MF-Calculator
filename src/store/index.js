import {configureStore} from '@reduxjs/toolkit'
import excelReducer from './excelSlice' 

const store = configureStore({
    reducer :{excelData : excelReducer}
})

export default store