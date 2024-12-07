import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/dbConnection.js';
import exphbs from 'express-handlebars';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.js'
import configRoutesFunction from './routes/index.js';

configurePassport(passport);
dotenv.config();
dotenv.config({ path: './config/config.env' });
const app = express();

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set app to use the handlebars engine and set handlebars configuration
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        compare: (a, b) => {
            return a === b;
        },
        encodeURIComponent: (value) => {
            return encodeURIComponent(value);
        },
    },
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

// Session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB();
configRoutesFunction(app);

// Start server
app.listen(3000, () => {
    console.log('=========================================');
    console.log("Server listening on port 3000");
    console.log('Routes running on http://localhost:3000');
    console.log('=========================================');
});