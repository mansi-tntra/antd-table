import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { CustomTable, DataTable } from "./components/dataTable";
import store, { persistor } from "./redux/store";
import { getTableList } from "./api/api";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <DataTable hasActions hasDeleteAction/>
          {/* <CustomTable
            hasSearch
            hasActions
            hasDeleteAction
            hasEditAction
            getApiCall={getTableList}
            rowReduxKey="row"
            columnReduxKey="column"
          /> */}
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
