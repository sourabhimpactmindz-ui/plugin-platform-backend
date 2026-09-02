import express from 'express'
import { GetPluginFeatures } from '../controller/feature.controller.js'
import { pluginAuth } from '../middleware/PluginAuth.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { GetDashboardView } from '../controller/dashboard.controller.js';

const PluginRouter = express.Router()

PluginRouter.get("/plugin/features",pluginAuth,GetPluginFeatures);
PluginRouter.get("/admin/dashboard",AuthMiddleware,GetDashboardView)

export default PluginRouter;