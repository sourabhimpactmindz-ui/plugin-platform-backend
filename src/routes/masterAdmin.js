import express from "express";
import { registerMaster, loginMaster , refreshToken , getme} from "../controller/auth.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/master/register", registerMaster);
router.post("/master/login", loginMaster);
router.post("/master/refresh", refreshToken);
router.get("/master/me" , AuthMiddleware , getme)


export default router;