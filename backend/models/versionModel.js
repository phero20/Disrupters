import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
    {
        version: {
            type: Number,
            required: true,
            default: 1,
        }
    },
    { timestamps: true }
);

const Version = mongoose.model("Version", versionSchema);

export default Version;
