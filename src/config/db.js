import mongoose from "mongoose";
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4'])
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database connected successfully");
    }catch(err){
        console.log(process.env.MONGO_URI)

        console.log("Error connecting to the database:", err);
        process.exit(1);
    }
}

export default connectDB;