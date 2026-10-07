import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product";

const products = [
  // Skin Care
  {
    name: "Gentle Face Wash",
    price: 299,
    category: "skin",
    image: "/images/face-wash.jpg",
    description: "A gentle face wash for everyday cleansing.",
    ingredients: "Aloe Vera, Glycerin",
    stock: 25,
  },

  {
    name: "Vitamin C Serum",
    price: 499,
    category: "skin",
    image: "/images/serum.jpg",
    description: "Lightweight serum for a fresh looking skin.",
    ingredients: "Vitamin C, Aloe Vera",
    stock: 20,
  },

  {
    name: "Daily Moisturizer",
    price: 349,
    category: "skin",
    image: "/images/moisturizer.jpg",
    description: "Hydrating moisturizer for daily use.",
    ingredients: "Shea Butter, Glycerin",
    stock: 30,
  },

  {
    name: "Sunscreen SPF 50",
    price: 599,
    category: "skin",
    image: "/images/sunscreen.jpg",
    description: "Daily sunscreen with SPF 50 protection.",
    ingredients: "Zinc Oxide, Vitamin E",
    stock: 15,
  },

  {
    name: "Rose Face Toner",
    price: 299,
    category: "skin",
    image: "/images/toner.jpg",
    description: "Refreshing toner for a clean skin routine.",
    ingredients: "Rose Water, Aloe Vera",
    stock: 22,
  },

  {
    name: "Lip Care Balm",
    price: 149,
    category: "skin",
    image: "/images/lip-balm.jpg",
    description: "Moisturizing balm for soft lips.",
    ingredients: "Shea Butter, Coconut Oil",
    stock: 35,
  },

  // Hair Care
  {
    name: "Daily Care Shampoo",
    price: 399,
    category: "hair",
    image: "/images/shampoo.jpg",
    description: "Gentle shampoo for everyday hair care.",
    ingredients: "Aloe Vera, Coconut Extract",
    stock: 25,
  },

  {
    name: "Smooth Hair Conditioner",
    price: 449,
    category: "hair",
    image: "/images/conditioner.jpg",
    description: "Conditioner for smooth and manageable hair.",
    ingredients: "Shea Butter, Argan Oil",
    stock: 20,
  },

  {
    name: "Nourishing Hair Oil",
    price: 299,
    category: "hair",
    image: "/images/hair-oil.jpg",
    description: "Nourishing oil for regular scalp care.",
    ingredients: "Coconut Oil, Almond Oil",
    stock: 30,
  },

  {
    name: "Repair Hair Mask",
    price: 499,
    category: "hair",
    image: "/images/hair-mask.jpg",
    description: "Hair mask for dry and damaged hair.",
    ingredients: "Argan Oil, Shea Butter",
    stock: 18,
  },

  {
    name: "Anti-Dandruff Shampoo",
    price: 449,
    category: "hair",
    image: "/images/anti-dandruff.jpg",
    description: "Cleansing shampoo for scalp care.",
    ingredients: "Tea Tree Oil, Aloe Vera",
    stock: 16,
  },

  {
    name: "Hair Growth Serum",
    price: 599,
    category: "hair",
    image: "/images/hair-serum.jpg",
    description: "Lightweight serum for regular hair care.",
    ingredients: "Argan Oil, Vitamin E",
    stock: 12,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products added successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();