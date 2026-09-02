import express from "express";
import { CreateFeature, DeleteFeature, Featurestatus, GetAll , updateFeature} from '../controller/feature.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const Featurerouter = express.Router();

Featurerouter.post("/feature/create" ,AuthMiddleware,CreateFeature )
Featurerouter.get("/feature/features", AuthMiddleware,GetAll)
Featurerouter.patch("/feature/:featureId", AuthMiddleware,Featurestatus)
Featurerouter.put("/feature/:featureId", AuthMiddleware,updateFeature)
Featurerouter.delete("/feature/:featureId", AuthMiddleware,DeleteFeature)


export default Featurerouter;