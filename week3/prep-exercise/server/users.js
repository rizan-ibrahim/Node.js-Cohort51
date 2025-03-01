import newDatabase from "./database.js";
import { v4 as uuid } from "uuid";

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false;
const database = newDatabase({ isPersistent });

// Create middlewares required for routes defined in app.js
// export const register = async (req, res) => {};

// You can also create helper functions in this file to help you implement logic
// inside middlewares
export const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ error: "username and password are required" });
  }

  // we check if user exist
  const userExist = database.getById(username);
  if (userExist) {
    return res.status(400).json({ error: "User already exists" });
  }

  // create  new user
  const newUser = database.create({ id: uuid(), username, password });
  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

// Middleware for user login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const user = database.getById(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "invaild username or password" });
  }

  res.status(200).json({ message: "Login successful", user });
};

// Middleware to get user profile
export const getProfile = async (req, res) => {
  const { userId } = req.params;
  const user = database.getById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({ user });
};

// Middleware  logout
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
