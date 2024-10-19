import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

    } catch (error) {
        console.log('====================================');
        console.log('Error connecting to MongoDB: ', error);
        console.log('====================================');
    }
}

export default connectDB;