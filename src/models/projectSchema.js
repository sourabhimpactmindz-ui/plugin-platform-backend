import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
      
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        domain: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        apiKey : {
            type : String,
            required : true,
            unique : true,
        },

        status: {
            type: String,
            enum: ["active", "disabled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const ProjectModel = mongoose.model(
    "Project",
    projectSchema
);

export default ProjectModel;