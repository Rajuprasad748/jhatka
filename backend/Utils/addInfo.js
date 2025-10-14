import mongoose from "mongoose";
import dotenv from "dotenv";
import ContactInfo from "../models/contactInfo.model.js"; // adjust path if needed

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`mongodb+srv://rajuprasad2004:XyqaLIJQ5ZhJTHCn@cluster0.gv9jjge.mongodb.net/Jhatka?retryWrites=true&w=majority`);

    console.log("MongoDB connected ✅");

    // Clear existing contact info (optional)

    // Add dummy contact info
    const contact = new ContactInfo({
      amount: 0
    });

    await contact.save();
    console.log("Dummy contact info added successfully ✅");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding contact info:", err);
    process.exit(1);
  }
};

seedData();
