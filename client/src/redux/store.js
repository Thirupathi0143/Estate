import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer 
});

const persistConfig = {
  key: "root",
  storage: storage,
  version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddelware) => {
    return getDefaultMiddelware({
      serializableCheck: false
    });
  }
});

export const presister = persistStore(store);