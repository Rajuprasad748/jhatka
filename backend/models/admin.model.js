import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  email:{
    type: String,
    unique: true,
  },
  role :{
    type: String,
    enum: ['tokenAdmin', 'betAdmin', 'superAdmin', 'basicAdmin'],
    default: 'basicAdmin',
  },
  password: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Admin", adminSchema);
