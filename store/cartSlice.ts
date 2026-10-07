import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.stock,
          existingItem.quantity + action.payload.quantity
        );
      } else {
        state.items.push({
          ...action.payload,
          quantity: Math.min(
            action.payload.stock,
            action.payload.quantity
          ),
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item) => item._id === action.payload.id
      );

      if (item) {
        item.quantity = Math.min(
          item.stock,
          Math.max(1, action.payload.quantity)
        );
      }
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;