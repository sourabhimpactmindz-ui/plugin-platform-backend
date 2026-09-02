import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MasterAdminModel from "../models/MasterAdmin.js";

export const registerMaster = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newMaster = new MasterAdminModel({
            email,
            password: hashedPassword
        })

        await newMaster.save();

        res.status(201).json({
            message: "master admin registered successfully", status: true, data: newMaster
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal server error", status: false, error: err.message
        })
    }
}

export const loginMaster = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required", status: false })
        }

        const master = await MasterAdminModel.findOne({ email });
        if (!master) {
            return res.status(404).json({ message: "Master admin not found", status: false })
        }

        const isPasswordValid = await bcrypt.compare(password, master.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password", status: false })
        }

        const accessToken = jwt.sign({
            id: master._id
        }, process.env.SECRET_KEY, { expiresIn: '15d' })

        const refreshToken = jwt.sign({
            id: master._id
        }, process.env.REFRESH_KEY, { expiresIn: '7d' })

        return res.status(200).json({
            message: "Login successful", status: true, accessToken, refreshToken
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal server error", status: false, error: err.message
        })
    }
}

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required", status: false })
    }
    try {


        const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY)

        const newAcessToken = jwt.sign({
            id: decoded.id
        }, process.env.SECRET_KEY, { expiresIn: '15d' })

        const newRefreshToken = jwt.sign({
            id: decoded.id
        }, process.env.REFRESH_KEY, { expiresIn: '7d' })

        return res.status(200).json({
            status: true, accessToken: newAcessToken, refreshToken: newRefreshToken
        })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error", status: false, error: err.message
        })
    }
}


export const getme = (req, res) => {
    return res.status(200).json({ message: "hello" })
}