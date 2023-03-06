import tableActionTypes from "./tableType";

const initialState = {};

const tableReducer = (state = { initialState }, action) => {
  switch (action.type) {
    case tableActionTypes.SAVE_TABLE_COLUMNS: {
      return {
        ...state,
        [action.key]: action.columnPayload,
      };
    }
    case tableActionTypes.SAVE_TABLE_ROWS: {
        return {
            ...state,
            [action.key] : action.rowPayload 
        }
    }

    default:
      return state;
  }
};

export default tableReducer