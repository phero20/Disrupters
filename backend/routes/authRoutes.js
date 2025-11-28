import express from "express";
import { loginUser, signupUser } from "../controllers/authControllers.js";

const authRouter = express.Router();

// 🔹 Signup Route
authRouter.post("/signup", signupUser);

// 🔹 Login Route
authRouter.post("/login", loginUser);

export default authRouter;
