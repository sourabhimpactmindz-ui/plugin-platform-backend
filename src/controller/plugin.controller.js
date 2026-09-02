import ProjectModel from "../models/projectSchema.js";
import jwt from "jsonwebtoken";

export const AuthanticatePlugin = async (req, res) => {

    const { projectId, apiKey } = req.body;

    try {

        if (!projectId || !apiKey) {
            return res.status(400).json({
                message: "Project ID and apiKey are required",
                status: false
            });
        }


        const existingProject =
            await ProjectModel.findById(projectId);


        if (!existingProject) {
            return res.status(401).json({
                message: "Project is not found",
                status: false
            });
        }


        // Project status check
        if (existingProject.status !== "active") {
            return res.status(403).json({
                message: "Project is inactive",
                status: false
            });
        }


        if (existingProject.apiKey !== apiKey) {
            return res.status(401).json({
                message: "Invalid credentials",
                status: false
            });
        }


        const accessToken = jwt.sign(
            {
                projectId:
                    existingProject._id.toString(),

                domain:
                    existingProject.domain
            },
            process.env.PLUGIN_ACCESS_KEY,
            {
                expiresIn: "7d"
            }
        );


        return res.status(200).json({
            message:
                "Plugin authenticated successfully",
            status: true,
            data: {
                accessToken
            }
        });

    } catch (err) {
    console.error("Plugin authentication error:", err);

    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      status: false,
    });
  }

};