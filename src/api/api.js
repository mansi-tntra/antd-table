import { get } from "../utility/client"



export const getList  =(body)=>{
   return get("/comments" , {...body})
}

export const getListing =(body)=>{
   return get("/users",{...body})
}
 