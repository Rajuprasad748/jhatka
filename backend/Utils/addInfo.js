import mongoose from "mongoose";
import dotenv from "dotenv";
import ContactInfo from "../models/contactInfo.model.js"; // adjust path if needed

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://rajuprasad2004:XyqaLIJQ5ZhJTHCn@cluster0.gv9jjge.mongodb.net/Jhatka?retryWrites=true&w=majority`
    );

    console.log("MongoDB connected ✅");

    // Clear existing contact info (optional)

    // Add dummy contact info
    const contact = await ContactInfo.findOneAndUpdate(
  {}, // find the single existing document
  {
    $set: {
      amount: 0,
      marquee: `"RoyalMoney10x में आपका स्वागत है! यहाँ आपको मिलेगा ऑनलाइन बेटिंग और गेमिंग का मस्त तड़का 🔥। हमारा प्लेटफ़ॉर्म है Safe, Secure और 100% भरोसेमंद—ताकि आप खेलें बिना किसी टेंशन के और मज़ा आए दोगुना।"`
    }
  },
  { upsert: true, new: true } // create if not exists
);


    await contact.save();
    console.log("Dummy contact info added successfully ✅");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding contact info:", err);
    process.exit(1);
  }
};

seedData();
