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
    await ContactInfo.deleteMany({});

    // Add dummy contact info
    const contact = new ContactInfo({
      contactNumber: "9755534587",
      email: "Royalmoney10x@gmail.com",
      telegram: "https://t.me/royalmoney10x",
      instagram: "https://www.instagram.com/lamp_of_happiness_?igsh=eDIzMjhyNHIzOG5y",
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
