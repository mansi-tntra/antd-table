import { applyMiddleware, compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/es/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer from "./rootReducer";

const isDev = process.env.NODE_ENV !== "production";

const persistConfig = {
  key: "antd-table",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
// To add redux devtools extension support
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// const middleware = [thunkMiddleware, logger];
const middleware = [thunkMiddleware];

// eslint-disable-next-line
const enhancer = isDev
  ? composeEnhancers(applyMiddleware(...middleware))
  : applyMiddleware(...middleware);

const store = configureStore({
  reducer: persistedReducer,
//   preLoadedState: initialState,
  middleware,
});

const persistor = persistStore(store);

export default store;

export { persistor };
