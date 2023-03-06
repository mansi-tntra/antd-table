import { combineReducers } from "redux";
import tableReducer from "./table/tableReducer";

const appReducer = combineReducers({
    table: tableReducer
})

const rootReducer =(state , action)=>{
  return appReducer(state,action)
}

export default rootReducer