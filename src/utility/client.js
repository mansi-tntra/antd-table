import axios from "axios";



const client = axios.create({
    baseURL : "https://jsonplaceholder.typicode.com/comments"
})


const get = (url , body , headers={})=>
    client.get(url , {prams: body , headers})

 

export {get} ;
export default client