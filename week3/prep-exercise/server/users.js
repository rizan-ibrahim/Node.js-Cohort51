import newDatabase from "./database.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

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
  const hashedPassword = await bcrypt.hash(password, 10);

  // we check if user exist
  // const userExist = database.getByUsername(username);
  // if (userExist) {
  //   return res.status(400).json({ error: "User already exists" });
  // }

  // create  new user
  const newUser = { username, password: hashedPassword };
  const storedUser = database.create(newUser);

  res.status(200).json({ id: storedUser.id, username: storedUser.username });
};

// Middleware for user login
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const user = database.getByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "invaild username or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).json({ message: " invalid credential" });
    // console.log("the hashed password doesn't match the new one ");
  }
  //////////////////////////// Payload///////secretOrPrivateKey///options
  const JwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
  return res.status(200).json({ JwtToken });
};

// Middleware to get user profile
export const getProfile = async (req, res) => {
  const JwtToken = req.headers.authorization?.split(" ")[1];
  if (!JwtToken) {
    return res.status(400).json({ message: "no tiken provided" });
  }
  jwt.verify(JwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(400).json({ message: "invalid or expired token" });
    }
    const user = database.getById(decoded.id);
    if (!user) {
      res.status(400).json({ message: "user not found" });
    }
    res.status(200).json({ username: user.username });
  });
};

// Middleware  logout
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
