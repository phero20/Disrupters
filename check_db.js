import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from './backend/models/feedbackModel.js';

dotenv.config({ path: './backend/.env' });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const allFeedbacks = await Feedback.find({});
        console.log(`Total Feedbacks: ${allFeedbacks.length}`);

        const negativeFeedbacks = await Feedback.find({ feedback: 'no' });
        console.log(`Negative Feedbacks: ${negativeFeedbacks.length}`);
        console.log(JSON.stringify(negativeFeedbacks, null, 2));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
