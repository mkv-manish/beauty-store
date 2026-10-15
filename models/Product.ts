import { categoryIds } from "../config/categories";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    category: {
      type: String,
      enum: categoryIds,
      required: true,
    },

    images: { type: [String], default: [] },

    image: {
      type: String,
      required: true,
    },

    description: {
  type: String,
  required: true,
},

ingredients: {
  type: String,
  required: true,
},

howToUse: {
  type: String,
  required: true,
},

stock: {
  type: Number,
  min: 0,
  validate: Number.isInteger,
  required: true,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);