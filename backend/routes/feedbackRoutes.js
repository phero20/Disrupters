import express from "express";
import { saveFeedback, getNegativeFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", saveFeedback);
router.get("/negative", getNegativeFeedback);

export default router;
