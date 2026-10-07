import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["skin", "hair"],
      required: true,
    },

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