import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';

export const createAppStore = () =>
  configureStore({
    reducer: {
      products: productsReducer,
    },
  });

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;