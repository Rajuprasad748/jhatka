// backend/models/ContactInfo.js
import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  telegram: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  amount:{
    type: Number,
    default: 0,
  },
  marquee: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);
export default ContactInfo;
