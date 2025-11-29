import express from "express";
import { loginUser, signupUser, getPatients } from "../controllers/authControllers.js";

const authRouter = express.Router();

// 🔹 Signup Route
authRouter.post("/signup", signupUser);

// 🔹 Login Route
// 🔹 Login Route
authRouter.post("/login", loginUser);

// 🔹 Get Patients Route
authRouter.get("/patients", getPatients);

export default authRouter;
