import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase/config";

const products = [
  {
    product: "Foil Container",
    category: "Packaging",
    stock: 500,
    price: 20,
    gst: 5,
    hsn: "7615",
    unit: "pcs",
  },
  {
    product: "Toothpick",
    category: "Packaging",
    stock: 1000,
    price: 2,
    gst: 5,
    hsn: "4421",
    unit: "pack",
  },
  {
    product: "Dustbin Cover S",
    category: "Packaging",
    stock: 300,
    price: 15,
    gst: 18,
    hsn: "3923",
    unit: "pcs",
  },
  {
    product: "Dustbin Cover M",
    category: "Packaging",
    stock: 250,
    price: 25,
    gst: 18,
    hsn: "3923",
    unit: "pcs",
  },
  {
    product: "Dustbin Cover L",
    category: "Packaging",
    stock: 200,
    price: 35,
    gst: 18,
    hsn: "3923",
    unit: "pcs",
  },
  {
    product: "Wooden Spoon",
    category: "Packaging",
    stock: 400,
    price: 10,
    gst: 5,
    hsn: "4419",
    unit: "box",
  },
  {
    product: "Foil Roll",
    category: "Packaging",
    stock: 150,
    price: 120,
    gst: 5,
    hsn: "7607",
    unit: "roll",
  },
];

export const seedProducts = async () => {
  try {
    for (const product of products) {
      await addDoc(
        collection(db, "inventory"),
        product
      );
    }

    console.log("Products Added");
  } catch (error) {
    console.error(error);
  }
};