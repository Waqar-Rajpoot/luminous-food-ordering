import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name?: string;
  username: string;
  email: string;
  imageURL?: string;
  password: string;
  role: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpire: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      minlength: [2, "Name must be at least 2 characters"],
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager", "staff"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: [true, "Verification code is required"],
    },
    verifyCodeExpire: {
      type: Date,
      required: [true, "Verification code expiration date is required"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
