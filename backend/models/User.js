import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Ensures 10-digit mobile number
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    walletBalance: {
      type: Number,
      default: 49, // ✅ Default balance for new users
      min: 0,        // Prevents negative balance
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
