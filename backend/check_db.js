import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from './models/feedbackModel.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const count = await Feedback.countDocuments({});
        const negativeCount = await Feedback.countDocuments({ feedback: 'no' });

        console.log(`Total: ${count}`);
        console.log(`Negative: ${negativeCount}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
