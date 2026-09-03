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
    origin: (origin, callback) => {

        if (!origin) {
            return callback(null, true);
        }

        const allowedOrigins = [
            "http://localhost:5173",
            "https://plugin-master-admins.vercel.app"
        ];

        // Allow permanent domains
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow Vercel deployment URLs
        if (
            /^https:\/\/plugin-master-admins.*\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());

app.use("/api" , router,ClientRouter,Featurerouter,PluginRouter , ProjectFeature);

export default app;