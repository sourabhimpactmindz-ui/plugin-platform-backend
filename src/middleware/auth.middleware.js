import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token Missing", status: false })
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.masterid = decoded.id
        next();
    } catch (err) {
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired", status: false })
        }
        return res.status(401).json({ message: "Invalid token", status: false })
    }

}