import bcrypt from "bcrypt";
import User from '../models/user.js'

// Login User Import
import { loginUser } from "../controllers/authController.js";

// Create User Controller
export const createUser = async (req, res, next) => {
  // Destructure req.body
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('All fields are required');
  }

  // Fetch User from Database
  const user = await User.findOne({ email });

  // User Check if exists already
  if (user) {
    return res.status(400).json({
      message: "Email Already Exists",
      status: "Bad Request",
    });
  }

  // Hash Password Input
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a regular user
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();

  res.status(201).json({
    message: 'User Created!'
  })
};

// Get All Users Controller
export const getAllUsers = async (req, res, next) => {
  // Check if user has been attached to req object
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the requested ID matches the authenticated user's ID
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch all Users from Database
  const users = await User.find();

  // Check if Users in database
  if (users.length === 0) {
    return res.status(200).json({
      data: [],
      message: "No Users Found",
      status: "Request Successful",
      metaData: {
        totalUsers: users.length,
      },
    });
  }

  // Send all Users
  res.status(200).json({
    data: users,
    message: "All Users Successfully Retrieved",
    status: "Request Successful",
    metaData: {
      totalUsers: users.length,
    },
  });
};

// Get Single User Controller
export const getUserById = async (req, res, next) => {
  // Check if user has been attached to req object
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the requested ID matches the authenticated user's ID
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch User from Database
  const user = await User.findById(req.params.id);

  // Check if User Exists
  if (!user) {
    return res.status(404).json({
      data: null,
      message: "User Does Not Exist",
      status: "Request Successful",
    });
  }

  // Send User
  res.status(200).json({
    data: user,
    message: "User Successfully Retrieved",
    status: "Request Successful",
  });
};

// Update User Controller
export const updateUser = async (req, res, next) => {
  // Check if user has been attached to req object
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the requested ID matches the authenticated user's ID
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch User From Database
  const user = await User.findById(req.params.id);

  // Check if User Exists
  if (!user) {
    return res.status(200).json({
      data: null,
      message: "User Does Not Exist",
      status: "Request Successful",
    });
  }

  // Destructure req.body
  const { email, password } = req.body;

  // Hash Password Input
  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { email, password: hashedPassword },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      data: null,
      message: "User Does Not Exist",
      status: "Request Successful",
    });
  }

  // Login user on update
  loginUser(req, res, updatedUser);
};

// Delete User Controller
export const deleteUser = async (req, res, next) => {
  // Check if user has been attached to req object
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if the requested ID matches the authenticated user's ID
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch User From Database
  const user = await User.findById(req.params.id);

  // Check if User Exists
  if (!user) {
    return res.status(200).json({
      data: null,
      message: "User Does Not Exist",
      status: "Request Successful",
    });
  }

  // If User Exists - Delete
  await User.findByIdAndDelete(req.params.id);

  // Send Response to Client
  res.status(200).json({
    message: "User Deleted Successfully",
    status: "Request Successful",
  });
};