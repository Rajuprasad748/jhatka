import mongoose from 'mongoose';

const connectDB = async () => {
 await  mongoose.connect(`mongodb+srv://rajuprasad2004:XyqaLIJQ5ZhJTHCn@cluster0.gv9jjge.mongodb.net/Jhatka?retryWrites=true&w=majority`)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));
};

export default connectDB;

