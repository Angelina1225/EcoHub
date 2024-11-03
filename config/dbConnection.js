import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectionString = process.env.DATABASE_URI;

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            autoIndex: true
        });
    } catch (error) {
        console.log('====================================');
        console.log('Error connecting to MongoDB: ', error);
        console.log('====================================');

        process.exit(1);
    }
};

export default connectDB;