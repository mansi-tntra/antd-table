import "./App.css"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DataTable } from "./components/dataTable";
import store, { persistor } from "./redux/store";
import { getList, getListing, getTableList } from "./api/api";
import AntTable from "./components/antdTable/table";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <DataTable hasActions hasDeleteAction/> */}
        <AntTable
          hasHideShow
          hasDeleteAction
          getApiCall={getListing}
          rowReduxKey="tableRow"
          columnReduxKey="tableColumn"
          pageSizeOptions={["10", "25", "50", "100"]}
        />
      </div>
    </Provider>
  );
}

export default App;
