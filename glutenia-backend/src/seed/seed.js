require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");

const products = [
  {
    name: "Pain sans gluten",
    description: "Pain moelleux pour le petit dejeuner.",
    price: 4.5,
    category: "Bread",
    stock: 25,
  },
  {
    name: "Pâtes de riz",
    description: "Pates de riz legeres pour plats rapides.",
    price: 3.2,
    category: "Pasta",
    stock: 30,
  },
  {
    name: "Biscuits au quinoa",
    description: "Biscuits croquants au quinoa.",
    price: 5.8,
    category: "Snacks",
    stock: 18,
  },
  {
    name: "Farine de maïs",
    description: "Farine de mais sans gluten.",
    price: 2.9,
    category: "Flour",
    stock: 40,
  },
  {
    name: "Gâteau au chocolat GF",
    description: "Gateau chocolat sans gluten.",
    price: 7.5,
    category: "Sweets",
    stock: 12,
  },
  {
    name: "Crackers de sarrasin",
    description: "Crackers sales au sarrasin.",
    price: 4.1,
    category: "Snacks",
    stock: 22,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin",
      email: "admin@glutenia.tn",
      password: hashedPassword,
      role: "admin",
    });

    await Product.insertMany(
      products.map((product) => ({
        ...product,
        isGlutenFree: true,
        createdBy: admin._id,
      }))
    );

    console.log("Seed completed successfully");
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
