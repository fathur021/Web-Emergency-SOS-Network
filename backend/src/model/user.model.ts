import mongoose from "mongoose";
import type { IUser } from "../interface/user.interface.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "volunteer", "admin"],
      default: "user",
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    locationName: {
      type: String,
      trim: true,
      default: "",
    },

    radius: {
      type: Number,
      default: 5000,
    },

    isVolunteerActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export { User };