// import mongoose, { Schema, Document } from "mongoose";

// export interface IReview extends Document {
//   name: string;
//   email: string;
//   rating: number;
//   review: string;
//   isApproved: boolean;
//   userId: mongoose.Types.ObjectId;
//   createdAt: Date;
// }

// const ReviewSchema: Schema<IReview> = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       match: [/.+@.+\..+/, "Please use a valid email address"],
//     },
//     rating: {
//       type: Number,
//       required: [true, "Rating is required"],
//       min: [1, "Rating must be at least 1 star"],
//       max: [5, "Rating cannot exceed 5 stars"],
//     },
//     review: {
//       type: String,
//       required: [true, "Review is required"],
//       minlength: [10, "Review must be at least 10 characters"],
//     },
//     isApproved: {
//       type: Boolean,
//       default: false,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const ReviewModel =
//   (mongoose.models.Review as mongoose.Model<IReview>) ||
//   mongoose.model<IReview>("Review", ReviewSchema);

// export default ReviewModel;




import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  review: string;
  isApproved: boolean;
  userId: mongoose.Types.ObjectId;
  orderId: string;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/.+@.+\..+/, "Please use a valid email address"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      minlength: [10, "Review must be at least 10 characters"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ userId: 1, orderId: 1, productId: 1 }, { unique: true });

const ReviewModel =
  (mongoose.models.Review as mongoose.Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default ReviewModel;