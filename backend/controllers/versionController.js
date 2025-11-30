import Version from "../models/versionModel.js";

// =========================================
// CREATE / UPDATE VERSION
// =========================================
export const createVersion = async (req, res) => {
    try {
        // Find the latest version to determine the next number
        const latestVersionDoc = await Version.findOne().sort({ createdAt: -1 });

        let nextVersion = 1;
        if (latestVersionDoc) {
            nextVersion = latestVersionDoc.version + 1;
        }

        // Create a NEW document for the new version
        const newVersion = await Version.create({ version: nextVersion });

        res.status(200).json({
            success: true,
            message: "New version created successfully.",
            data: newVersion,
        });
    } catch (error) {
        console.error("Error creating version:", error);
        res.status(500).json({ message: "Server error creating version." });
    }
};

// =========================================
// GET ALL VERSIONS
// =========================================
export const getVersions = async (req, res) => {
    try {
        // Get ALL versions sorted by latest first
        const versions = await Version.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: versions,
        });
    } catch (error) {
        console.error("Error fetching versions:", error);
        res.status(500).json({ message: "Server error fetching versions." });
    }
};
