// src/models/Category.js

export interface ICategory {
  _id: string;
  name: string;
}

import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    unique: true, // Category names should be unique
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters'],
  },
  // You can add other fields like description, order, etc. if needed
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
