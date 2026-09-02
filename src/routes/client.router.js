import express from "express";
import { CreateClient , GetAllClients , SingleClient , DeleteClient, UpdateClients} from "../controller/client.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { AllProject, CreateProject, DeleteProject, ProjectStatus } from "../controller/project.controller.js";
import { AuthanticatePlugin } from "../controller/plugin.controller.js";
const ClientRouter = express.Router();

ClientRouter.post("/client/register" , AuthMiddleware,CreateClient);
ClientRouter.get("/client/all" , AuthMiddleware,GetAllClients);
ClientRouter.get("/client/:clientId" , AuthMiddleware,SingleClient);
ClientRouter.delete("/client/:clientId" , AuthMiddleware,DeleteClient);
ClientRouter.patch("/client/:clientId" , AuthMiddleware,UpdateClients);
ClientRouter.post("/project/create" , AuthMiddleware , CreateProject);
ClientRouter.get("/project/get" , AuthMiddleware , AllProject);
ClientRouter.patch("/project/:projectId" , AuthMiddleware , ProjectStatus);
ClientRouter.delete("/project/:projectId" , AuthMiddleware , DeleteProject);
ClientRouter.post("/auth/plugin",AuthanticatePlugin);

export default ClientRouter;
