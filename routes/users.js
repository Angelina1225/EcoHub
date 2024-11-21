import { Router } from 'express';
const router = Router();
import { User } from '../models/User.js'

router
    .route('/')
    .get(async (req, res) => {
        try {
            res.render('./users/login', {
                layout: 'login',
                title: 'Login'
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        const { email, password } = req.body;
        let user = await User.findOne({ email: email })
        try {
            if (!user) {
                return res.render('./users/login', {
                    layout: 'login',
                    title: 'Login',
                    hasError: true,
                    error: "Invalid email or password"
                });
            }

            if (user.password !== password) {
                return res.render('./users/login', {
                    layout: 'login',
                    title: 'Login',
                    hasError: true,
                    error: "Invalid email or password"
                });
            }
            return res.redirect('/home');
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router
    .route('/signup')
    .get(async (req, res) => {
        try {
            res.render('./users/signup', {
                layout: 'login',
                title: 'Signup'
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        const { firstName, lastName, userName, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.render('./users/signup', {
                layout: 'login',
                title: 'Signup',
                hasError: true,
                error: "Passwords don't match"
            });
        }

        try {
            let user = await User.findOne({ email: email })
            if (user) {
                res.render('./users/signup', {
                    layout: 'login',
                    title: 'Signup',
                    hasError: true,
                    error: "User already registered with the same email"
                });
            } else {
                const newUser = { firstName, lastName, userName, email, password };
                user = await User.create(newUser)
                res.redirect('/login');
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const eMsg = Object.values(err.errors).map((e) => e.message).join(', ');
                res.render('./users/signup', {
                    layout: 'login',
                    title: 'Signup',
                    hasError: true,
                    error: eMsg
                });
            }

            if (err.code === 11000) {
                return res.render('signup', { hasError: true, error: 'Username or email already exists' });
            }
        }
    });

router
    .route('/home')
    .get(async (req, res) => {
        try {
            res.render('./users/home', {
                layout: 'main',
                title: 'Home'
            });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    })


export default router;  