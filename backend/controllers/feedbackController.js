import Feedback from "../models/feedbackModel.js";

// @desc    Save feedback and prediction data
// @route   POST /api/feedback
// @access  Public (or Private if auth needed)
export const saveFeedback = async (req, res) => {
    try {
        const feedbackData = req.body;
        console.log("Backend received feedback data:", feedbackData);

        const newFeedback = await Feedback.create(feedbackData);

        res.status(201).json({
            success: true,
            message: "Feedback saved successfully",
            data: newFeedback,
        });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// @desc    Get all negative feedback (feedback = 'no')
// @route   GET /api/feedback/negative
// @access  Public (or Private if auth needed)
export const getNegativeFeedback = async (req, res) => {
    try {
        const negativeFeedbacks = await Feedback.find({ feedback: 'no' }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: negativeFeedbacks.length,
            data: negativeFeedbacks,
        });
    } catch (error) {
        console.error("Error fetching negative feedback:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
