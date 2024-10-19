import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/dbConnection.js';

const app = express();
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from express');
});

// Initial connection to the MongoDB server
mongoose.connection.once('open', () => {
    console.log('====================================');
    console.log('Connected to MongoDB');
    console.log('====================================');

    // Starts the server and listens on the specified port
    app.listen(PORT, () => {
        console.log('====================================');
        console.log(`Server listening on port ${PORT}`);
        console.log('====================================');
    })
});