// File: models/Settings.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRestaurantSettings extends Document {
  openingTime: string;
  closingTime: string;
  isClosedToday: boolean;
  lastOrderTime: string;
  maxPartySize: number;
  reservationEnabled: boolean;
  phoneNumber: string;
  publicEmail: string;
  address: string;
}

const SettingsSchema: Schema = new Schema({
  openingTime: { type: String, default: "10:00" },
  closingTime: { type: String, default: "22:00" },
  isClosedToday: { type: Boolean, default: false },
  lastOrderTime: { type: String, default: "21:30" },
  maxPartySize: { type: Number, default: 6 },
  reservationEnabled: { type: Boolean, default: true },
  phoneNumber: { type: String, default: "+92 3XX XXXXXXX" },
  publicEmail: { type: String, default: "info@restaurant.com" },
  address: { type: String, default: "123 Restaurant St." },
});

// Use existing model if it exists, otherwise create a new one
const SettingsModel: Model<IRestaurantSettings> = 
  (mongoose.models.Settings as Model<IRestaurantSettings>) || 
  mongoose.model<IRestaurantSettings>('Settings', SettingsSchema);

export default SettingsModel;