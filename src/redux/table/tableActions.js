import tableActionTypes from "./tableType";

export const saveTableColumn = (key , column=[])=>
  (dispatch)=>{
     dispatch({
        type: tableActionTypes.SAVE_TABLE_COLUMNS,
        key,
        columnPayload : column
     })
  }
  


export const saveTableRows = (key , rows=[])=>
    (dispatch)=>{
        dispatch({
            type: tableActionTypes.SAVE_TABLE_ROWS,
            key,
            rowPayload : rows
        })
    }
