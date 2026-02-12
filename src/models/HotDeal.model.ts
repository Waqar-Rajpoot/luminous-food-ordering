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