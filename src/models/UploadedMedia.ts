// src/models/UploadedMedia.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUploadedMedia extends Document {
  url: string;
  fileType: 'image' | 'video';
  fileName: string;
  uploadedAt: Date;
}

const UploadedMediaSchema: Schema = new Schema({
  url: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video'], required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Avoid Mongoose's OverwriteModelError in Next.js development
const UploadedMedia = mongoose.models.UploadedMedia || mongoose.model<IUploadedMedia>('UploadedMedia', UploadedMediaSchema);

export default UploadedMedia;