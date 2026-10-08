import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import Product from "../models/Product";

const products = [
  // -------------------------
  // Skin Care
  // -------------------------
  {
    name: "Gentle Face Wash",
    price: 299,
    category: "skin",
    image: "/images/face-wash.png",
    description: "A gentle face wash for everyday cleansing.",
    ingredients: "Aloe Vera, Glycerin",
    howToUse:
      "Apply to wet face, massage gently and rinse with water.",
    stock: 25,
  },

  {
    name: "Vitamin C Serum",
    price: 499,
    category: "skin",
    image: "/images/serum.png",
    description: "Lightweight serum for a fresh looking skin.",
    ingredients: "Vitamin C, Aloe Vera",
    howToUse:
      "Apply a few drops to clean skin and gently massage.",
    stock: 20,
  },

  {
    name: "Daily Moisturizer",
    price: 349,
    category: "skin",
    image: "/images/moisturizer.png",
    description: "Hydrating moisturizer for daily use.",
    ingredients: "Shea Butter, Glycerin",
    howToUse:
      "Apply a small amount to clean face and massage gently.",
    stock: 30,
  },

  {
    name: "Sunscreen SPF 50",
    price: 599,
    category: "skin",
    image: "/images/sunscreen.png",
    description: "Daily sunscreen with SPF 50 protection.",
    ingredients: "Zinc Oxide, Vitamin E",
    howToUse:
      "Apply evenly to exposed skin before going outdoors.",
    stock: 15,
  },

  {
    name: "Rose Face Toner",
    price: 299,
    category: "skin",
    image: "/images/toner.png",
    description: "Refreshing toner for a clean skin routine.",
    ingredients: "Rose Water, Aloe Vera",
    howToUse:
      "Apply toner to clean skin using a cotton pad.",
    stock: 22,
  },

  {
    name: "Lip Care Balm",
    price: 149,
    category: "skin",
    image: "/images/lip-balm.png",
    description: "Moisturizing balm for soft lips.",
    ingredients: "Shea Butter, Coconut Oil",
    howToUse:
      "Apply a small amount to your lips whenever needed.",
    stock: 35,
  },

  // -------------------------
  // Hair Care
  // -------------------------
  {
    name: "Daily Care Shampoo",
    price: 399,
    category: "hair",
    image: "/images/shampoo.png",
    description: "Gentle shampoo for everyday hair care.",
    ingredients: "Aloe Vera, Coconut Extract",
    howToUse:
      "Apply to wet hair, massage the scalp and rinse thoroughly.",
    stock: 25,
  },

  {
    name: "Smooth Hair Conditioner",
    price: 449,
    category: "hair",
    image: "/images/conditioner.png",
    description: "Conditioner for smooth and manageable hair.",
    ingredients: "Shea Butter, Argan Oil",
    howToUse:
      "Apply to wet hair lengths and rinse after a few minutes.",
    stock: 20,
  },

  {
    name: "Nourishing Hair Oil",
    price: 299,
    category: "hair",
    image: "/images/hair-oil.png",
    description: "Nourishing oil for regular scalp care.",
    ingredients: "Coconut Oil, Almond Oil",
    howToUse:
      "Apply to the scalp and hair, massage gently and leave for some time.",
    stock: 30,
  },

  {
    name: "Repair Hair Mask",
    price: 499,
    category: "hair",
    image: "/images/hair-mask.png",
    description: "Hair mask for dry and damaged hair.",
    ingredients: "Argan Oil, Shea Butter",
    howToUse:
      "Apply to clean wet hair, leave for 10 minutes and rinse.",
    stock: 18,
  },

  {
    name: "Anti-Dandruff Shampoo",
    price: 449,
    category: "hair",
    image: "/images/anti-dandruff.png",
    description: "Cleansing shampoo for scalp care.",
    ingredients: "Tea Tree Oil, Aloe Vera",
    howToUse:
      "Apply to wet scalp, massage gently and rinse thoroughly.",
    stock: 16,
  },

  {
    name: "Hair Growth Serum",
    price: 599,
    category: "hair",
    image: "/images/hair-serum.png",
    description: "Lightweight serum for regular hair care.",
    ingredients: "Argan Oil, Vitamin E",
    howToUse:
      "Apply a small amount to the scalp and massage gently.",
    stock: 12,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in .env.local");
    }

    await mongoose.connect(mongoUri);

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log("Database seeded successfully.");
    console.log(`${products.length} products added.`);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();