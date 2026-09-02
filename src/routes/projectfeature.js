import express from "express";

import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { AllProjectFeature, UpdateProjectFeatureStatus} from "../controller/feature.controller.js";

const ProjectFeature = express.Router();

ProjectFeature.get("/project/project-features/:projectId" , AuthMiddleware , AllProjectFeature)
ProjectFeature.patch("/project/:projectId/features/:featureId" , AuthMiddleware , UpdateProjectFeatureStatus )


export default ProjectFeature;