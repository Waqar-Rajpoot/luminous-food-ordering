// models/ContactMessage.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/.+@.+\..+/, 'Please use a valid email address'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    minlength: [5, 'Subject must be at least 5 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  isRead:{
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  }
}, {
  timestamps: true 
});

const ContactMessageModel = (mongoose.models.ContactMessage as mongoose.Model<IContactMessage> || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema));

export default ContactMessageModel;
