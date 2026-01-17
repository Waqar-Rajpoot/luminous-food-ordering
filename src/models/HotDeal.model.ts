// import mongoose, { Schema, Document } from "mongoose";

// interface IDealItem {
//   productId: mongoose.Types.ObjectId; // Link to actual Product model
//   name: string;      // Cached name (in case product name changes)
//   quantity: number;  // e.g., 2 (for 2 burgers in one deal)
//   size?: string;     // e.g., "Large" or "1.5 Litre"
// }

// export interface IDeal extends Document {
//   title: string;
//   slug: string;        // For SEO friendly URLs (e.g., /deal/midnight-feast)
//   description: string;
//   originalPrice: number; // Sum of individual items
//   dealPrice: number;     // The discounted price
//   savings: number;       // Automatically calculated: original - deal
//   image: string;
//   items: IDealItem[];    // Detailed list of products
//   category: string;      // e.g., "Midnight Deals", "Family Bundles"
//   isAvailable: boolean;
//   availableDays?: string[]; // e.g., ["Friday", "Saturday"]
//   startTime?: string;    // e.g., "12:00 PM" (for time-specific deals)
//   endTime?: string;      // e.g., "03:00 AM"
//   popularity: number;    // To sort by "Most Ordered"
//   createdAt: Date;
//   updatedAt: Date;
// }

// const DealItemSchema = new Schema<IDealItem>({
//   name: { type: String, required: true },
//   quantity: { type: Number, required: true, default: 1 },
//   size: { type: String }
// });

// const DealSchema = new Schema<IDeal>(
//   {
//     title: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     description: { type: String, required: true },
//     originalPrice: { type: Number, required: true },
//     dealPrice: { type: Number, required: true },
//     savings: { type: Number },
//     image: { type: String, required: true },
//     items: [DealItemSchema], // Array of the sub-schema defined above
//     category: { type: String, default: "Deals", index: true },
//     isAvailable: { type: Boolean, default: true },
//     availableDays: [{ type: String }], 
//     startTime: { type: String },
//     endTime: { type: String },
//     popularity: { type: Number, default: 0 }
//   },
//   { timestamps: true }
// );

// // Middleware to calculate savings before saving
// DealSchema.pre("save", function (next) {
//   if (this.originalPrice && this.dealPrice) {
//     this.savings = this.originalPrice - this.dealPrice;
//   }
//   next();
// });

// export default mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema);



// import mongoose, { Schema, Document } from "mongoose";
// // import slugify from "slugify";

// export interface IDeal extends Document {
//   title: string;
//   description: string;
//   originalPrice: number;
//   dealPrice: number;
//   savings: number;
//   image: string;
//   items: Array<{ name: string; quantity: number; size?: string }>;
//   category: string;
//   isAvailable: boolean;
//   availableDays: string[];
//   startDate: { type: Date }, 
//   endDate: { type: Date },
// }

// const DealSchema = new Schema<IDeal>({
//   title: { type: String, required: true, trim: true },
//   description: { type: String, required: true },
//   originalPrice: { type: Number, required: true },
//   dealPrice: { type: Number, required: true },
//   savings: { type: Number },
//   image: { type: String, required: true },
//   items: [{
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true, default: 1 },
//     size: { type: String }
//   }],
//   category: { type: String, default: "Deals" },
//   isAvailable: { type: Boolean, default: true },
//   availableDays: { type: [String], default: [] },
//   startDate: { type: Date }, 
//   endDate: { type: Date },
// }, { timestamps: true });

// DealSchema.pre("save", function(next) {
//   if (this.originalPrice && this.dealPrice) {
//     this.savings = this.originalPrice - this.dealPrice;
//   }
//   next();
// });

// export default mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema);







import mongoose, { Schema, Document } from "mongoose";

export interface IDeal extends Document {
  title: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  savings: number;
  image: string;
  items: Array<{ name: string; quantity: number; size?: string }>;
  category: string;
  isAvailable: boolean;
  availableDays: string[];
  startDate: Date; // Cleaned up
  endDate: Date;   // Cleaned up
}

const DealSchema = new Schema<IDeal>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  dealPrice: { type: Number, required: true },
  savings: { type: Number },
  image: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    size: { type: String }
  }],
  category: { type: String, default: "Deals" },
  isAvailable: { type: Boolean, default: true },
  availableDays: { type: [String], default: [] },
  startDate: { type: Date }, 
  endDate: { type: Date },
}, { timestamps: true });

// Updated Middleware to fix TS2349
DealSchema.pre("save", function() {
  if (this.originalPrice && this.dealPrice) {
    this.savings = this.originalPrice - this.dealPrice;
  }
});

export default mongoose.models.Deal || mongoose.model<IDeal>("Deal", DealSchema);