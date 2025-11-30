import express from "express";
import { saveFeedback, getNegativeFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", saveFeedback);
router.get("/negative", getNegativeFeedback);
router.get("/", getAllFeedback);

export default router;
