import dotenv from 'dotenv';
import express from 'express';
dotenv.config({ path: './config/config.env' })

import passport from 'passport'
import session from 'express-session'
import configurePassport from './config/passport.js'

configurePassport(passport)

import mongoose from 'mongoose';
import connectDB from './config/dbConnection.js';
import exphbs from 'express-handlebars';

dotenv.config();
const app = express();

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'secret',
    resave: false, 
    saveUninitialized: false 
    //cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();

import hbs from 'hbs';
hbs.registerHelper('formatDate', function (date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

import configRoutesFunction from './routes/index.js';
configRoutesFunction(app)

app.listen(3000, () => {
    console.log('=========================================');
    console.log("Server listening on port 3000");
    console.log('Routes running on http://localhost:3000');
    console.log('=========================================');
});