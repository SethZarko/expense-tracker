import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateToken } from '../auth/generateJWT.js';

export const loginUser = async (req, res) => {
  try {
    // Otherwise, handle login logic
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('All fields are required');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error('Invalid user credentials');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      throw new Error('Invalid user credentials');
    }

    return res.status(200).json({
      message: 'User Logged In',
      status: 'Request Successful',
      token: generateToken(existingUser._id),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
