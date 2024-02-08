import { useSelector } from "react-redux";
import { excelAction} from "./excelSlice";

export const addexcel=(excel)=>{
   
    return async(dispatch)=>{
    try{
        console.log("inside actions")
        dispatch(
            excelAction.add({
                ...excel,
            })
        )
    }catch(error){
        console.log(error.message)
    }

    const data1 = useSelector(state=>state)
    console.log(data1)
   
    }
}
