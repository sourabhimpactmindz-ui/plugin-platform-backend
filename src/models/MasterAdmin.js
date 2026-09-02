import mongoose from "mongoose";
const MasterAdmin = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    }
}, { timestamp: true });

export default mongoose.model("MasterAdmin", MasterAdmin);