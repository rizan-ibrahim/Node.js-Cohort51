import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { register, login, getProfile, logout } from "./users.js";

let app = express();

app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get("/getProfile", getProfile);
app.post("/logout", logout);

// Serve the front-end application from the `client` folder
app.use(express.static("client"));

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
