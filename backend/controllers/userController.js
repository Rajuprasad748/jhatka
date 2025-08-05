import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { GenerateToken , findUserById } from '../services/user.services.js';

export const registerUser = async (req, res) => {

  const { name, email, password } = req.body;
  
  const userExists = await findUserById(email);

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({ name, email, password: hashedPassword });

  const token = GenerateToken(user);

  res.json({ token, user: { id: user._id, name, email } });
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user by email
  const user = await findUserById(email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = GenerateToken(user);

  // Respond with token and user info
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};




