import mongoose, { Document, Schema } from "mongoose";
export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  finalPrice?: number;
}

export interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface IOrder extends Document {
  stripeSessionId?: string;
  orderId: string;
  userId: mongoose.Types.ObjectId;
  customerEmail: string;
  customerName?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  orderStatus: "pending" | "paid" | "canceled";
  shippingProgress: "processing" | "shipped" | "delivered" | "canceled";
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  deliveryOTP: string;
  isOTPVerified: boolean;
  deliveryOTPExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  finalPrice: { type: Number },
});

const ShippingAddressSchema: Schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "Pakistan" },
  phoneNumber: { type: String, required: true },
});

const OrderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    stripeSessionId: { type: String },
    orderId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerEmail: { type: String, required: true },
    customerName: { type: String },
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "pkr" },
    orderStatus: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    shippingProgress: {
      type: String,
      enum: ["processing", "shipped", "delivered", "canceled"],
      default: "processing",
    },
    deliveryOTP: { 
      type: String, 
      required: true 
    },
    isOTPVerified: { 
      type: Boolean, 
      default: false 
    },
    deliveryOTPExpiry: { 
      type: Date 
    },
    items: { type: [OrderItemSchema], required: true },
    shippingAddress: { type: ShippingAddressSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;