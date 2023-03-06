import { get } from "../utility/client"

export const getTableList =(body)=>{
   console.log("body" , ...body)
   return get({...body})
}