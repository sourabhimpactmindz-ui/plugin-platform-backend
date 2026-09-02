import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const pluginAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;
    

    if (!authHeader) {
        return res.status(401).json({
            message: "Token missing",
            status: false
        });
    }

    const  token= authHeader.split(" ")[1];

    if ( !token) {
        return res.status(401).json({
            message: "Invalid authorization format",
            status: false
        });
    }

    try {
       
        const decoded = jwt.verify(
            token,
            process.env.PLUGIN_ACCESS_KEY
        );
      
       

        req.data = decoded;

        next();

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired",
                status: false
            });
        }

        return res.status(401).json({
            message: "Invalid token",
            status: false
     , error : err.message   } );
    }
};