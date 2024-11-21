import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import connectDB from './config/dbConnection.js';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';
import path from 'path';
dotenv.config({path: './config/config.env'});
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.js';
import configRoutesFunction from './routes/index.js';

dotenv.config();
const PORT = 3000;

// // Get the resolved path to the file and the name of the directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Instance of the Express application
const app = express();

// // Set up Express server to serve static files from the public directory
// const staticDir = express.static(__dirname + '/public');
// app.use('/public', staticDir);

app.use('/public', express.static('public'));

// Middleware for URL-encoded data (HTML form with method='POST') and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set app to use the handlebars engine and set handlebars configuration
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'secret',
    resave: false, //not saving session if nothing is modified
    saveUninitialized: false //don't create a session until something is stored
    //cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();
configRoutesFunction(app);
configurePassport(passport);

// Initial connection to the MongoDB server
mongoose.connection.once('open', () => {
    console.log('=========================================');
    console.log('Connected to MongoDB');
    console.log('=========================================');

    // Starts the server and listens on the specified port
    app.listen(3000, () => {
        console.log('=========================================');
        console.log(`Server listening on port ${PORT}`);
        console.log(`Routes running on http://localhost:${3000}`);
        console.log('=========================================');
    });  
});
