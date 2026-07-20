import { configureStore } from "@reduxjs/toolkit";
import { transactionApi } from "./api/transactionApi";
import { aiApi } from "./api/aiApi";
import { blogApi } from "./api/blogApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [transactionApi.reducerPath]: transactionApi.reducer,
      [aiApi.reducerPath]: aiApi.reducer,
      [blogApi.reducerPath]: blogApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault().concat(
        transactionApi.middleware,
        aiApi.middleware,
        blogApi.middleware,
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
