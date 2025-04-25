import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB)
        console.log('Database connected successfully');
        
    }catch(error){
        console.log(error)
    }
}

export default connectToDatabase