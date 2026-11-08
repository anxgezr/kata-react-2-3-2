import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { getProducts } from '../services/productsApi';

import type {
  CartItem,
  Product,
} from '../types/product';

interface ProductsState {
  products: Product[];
  quantities: Record<number, number>;
  cart: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  quantities: {},
  cart: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts();

      return products;
    } catch {
      return rejectWithValue(
        'Не удалось загрузить каталог. Проверьте подключение к интернету и попробуйте обновить страницу.'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',

  initialState,

  reducers: {
    setQuantity(
      state,
      action: PayloadAction<{
        productId: number;
        quantity: number;
      }>
    ) {
      const { productId, quantity } = action.payload;

      state.quantities[productId] = Math.max(1, quantity);
    },

    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;

      const quantity = state.quantities[product.id] ?? 1;

      const existing = state.cart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({
          ...product,
          quantity,
        });
      }
    },

    removeOneFromCart(
      state,
      action: PayloadAction<number>
    ) {
      const productId = action.payload;

      const item = state.cart.find(
        (cartItem) => cartItem.id === productId
      );

      if (!item) return;

      if (item.quantity <= 1) {
        state.cart = state.cart.filter(
          (cartItem) => cartItem.id !== productId
        );
      } else {
        item.quantity -= 1;
      }
    },

    clearCart(state) {
      state.cart = [];
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';

        state.error =
          action.payload ??
          'Произошла ошибка при загрузке товаров.';
      });
  },
});

export const {
  setQuantity,
  addToCart,
  removeOneFromCart,
  clearCart,
} = productsSlice.actions;

export default productsSlice.reducer;