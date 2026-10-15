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
  hydrated: boolean;
  items: CartItem[];
};

export const initialCartState: CartState = {
  hydrated: false,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,

  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!Number.isInteger(action.payload.quantity) || action.payload.quantity < 1 || action.payload.stock < 1) return;
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

      if (item && Number.isInteger(action.payload.quantity)) {
        item.quantity = Math.min(
          item.stock,
          Math.max(1, action.payload.quantity)
        );
      }
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.hydrated = true;
      state.items = action.payload.filter(item => item && typeof item._id === "string" && /^[a-f0-9]{24}$/i.test(item._id) && typeof item.name === "string" && typeof item.image === "string" && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.stock) && item.stock > 0 && Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({ ...item, quantity: Math.min(item.stock, item.quantity) }));
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