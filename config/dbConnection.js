import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { mongoConfig } from './settings.js';

dotenv.config();
const connectionString = `${mongoConfig.serverUrl}${mongoConfig.database}`;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            autoIndex: true
        });

        console.log('=========================================');
        console.log('Connected to MongoDB');
        console.log('=========================================');
    } catch (error) {
        console.log('=========================================');
        console.log('Error connecting to MongoDB: ', error);
        console.log('=========================================');

        process.exit(1);
    }
};

export default connectDB;