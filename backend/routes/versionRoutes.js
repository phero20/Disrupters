import express from "express";
import { createVersion, getVersions } from "../controllers/versionController.js";

const router = express.Router();

router.post("/", createVersion);
router.get("/", getVersions);

export default router;
