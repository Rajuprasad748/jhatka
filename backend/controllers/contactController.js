import ContactInfo from "../models/contactInfo.model.js";

// Get current contact info
export const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.find({});
    if (!info) return res.status(404).json({ message: "No contact info found" });
    res.json(info);
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update single field
export const updateContactField = async (req, res) => {
  try {
    const { field, value } = req.body;

    const allowedFields = ["contactNumber", "email", "telegram", "instagram" , "marquee"];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }

    const info = await ContactInfo.findOne({});
    if (!info) return res.status(404).json({ message: "Contact info not found" });

    info[field] = value;
    await info.save();

    res.json({ message: `${field} updated successfully`, updatedField: field, newValue: value });
  } catch (err) {
    console.error("Error updating contact info:", err);
    res.status(500).json({ message: "Server error" });
  }
};
