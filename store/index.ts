import { configureStore } from "@reduxjs/toolkit";
import { transactionApi } from "./api/transactionApi";
import { aiApi } from "./api/aiApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [transactionApi.reducerPath]: transactionApi.reducer,
      [aiApi.reducerPath]: aiApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(transactionApi.middleware, aiApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
