import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["add", "remove"], // credit = add tokens, debit = remove tokens
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Token", tokenSchema);
