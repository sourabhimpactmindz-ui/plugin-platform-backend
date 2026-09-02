import express from "express";
import dotenv from "dotenv";
import router from "./src/routes/masterAdmin.js";
import ClientRouter from "./src/routes/client.router.js";
import Featurerouter from "./src/routes/feature.route.js";
import PluginRouter from "./src/routes/plugin.route.js";
import ProjectFeature from "./src/routes/projectfeature.js";
import cors from 'cors'
dotenv.config();
const app = express();

app.use(cors({
    origin : process.env.FRONT_URL
}))

app.use(express.json());

app.use("/api" , router,ClientRouter,Featurerouter,PluginRouter , ProjectFeature);

export default app;