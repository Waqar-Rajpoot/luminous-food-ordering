import mongoose from "mongoose";
export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageSrc: string;
  description: string;
  isAvailable: boolean;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Updated Mongoose Schema
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this product."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price for this product."],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category for this product."],
    },
    imageSrc: {
      type: String,
      required: [true, "Please provide an image source for this product."],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      min: [0, "Sales count cannot be negative"],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<Product>("Product", ProductSchema);
