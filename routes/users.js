import { Router } from 'express';
const router = Router();
import {User} from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

router
    .route('/')
    .get(async (req, res) => {
        try {
            return res.render('./users/login', {
                layout: 'login',
                title: 'EcoHub | Login'
            });
        } catch (e) {
            return res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const { email, password } = req.body;
        let user = await User.findOne({ email: email })
        try {
            if (!user) {
                return res.render('./users/login', {
                    layout: 'login',
                    title: 'EcoHub | Login',
                    hasError: true,
                    error: "Invalid email or password"
                });
            }

            if (user.password !== password) {
                return res.render('./users/login', {
                    layout: 'login',
                    title: 'EcoHub | Login',
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
            return res.render('./users/signup', {
                layout: 'login',
                title: 'EcoHub | Signup'
            });
        } catch (e) {
            return res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const { firstName, lastName, userName, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('./users/signup', {
                layout: 'login',
                title: 'EcoHub | Signup',
                hasError: true,
                error: "Passwords don't match"
            });
        }
    
        try{
            let user = await User.findOne({email: email})
            if(user){
                return res.render('./users/signup', {
                    layout: 'login',
                    title: 'EcoHub | Signup',
                    hasError: true,
                    error: "User already registered with the same email"
                });
            } else {
                const newUser = { firstName, lastName, userName, email, password };
                user = await User.create(newUser)
                return res.redirect('/login');
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const eMsg = Object.values(err.errors).map((e) => e.message).join(', ');
                return res.render('./users/signup', {
                    layout: 'login',
                    title: 'EcoHub | Signup',
                    hasError: true,
                    error: eMsg
                });
            }
            console.log(err)
            if (err.code === 11000) {
                return res.render('./users/signup', { 
                    layout: 'login',
                    title: 'EcoHub | Signup',
                    hasError: true, 
                    error: 'Username or email already exists' 
                });
            }
        }
    });

router
    .route('/home')
    .get(async (req, res) => {
        try {
            return res.render('./users/home', {
                layout: 'main',
                title: 'EcoHub | Home'
            });
        } catch (e) {
            return res.status(500).json({error: e});
        }
    })

router  
    .route('/reset')
    .get(async (req, res) => {
        try {
            return res.render('./users/reset', {
                layout: 'login',
                title: 'EcoHub | Forgot password'
                });
        } catch (e) {
            return res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {email} = req.body;
        let user = await User.findOne({email: email});
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

        try{
            if(!user){
                return res.status(404).json({error: 'User not found'});
            }

            await User.findOneAndUpdate(
                {email: email},
                {$set: {resetToken: resetToken, 
                    resetTokenExpiry: resetTokenExpiry} }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ecohub06@gmail.com',
                    pass: 'ajtojdtokjprxhez'
                }
            })

            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
            const mailOptions = {
                from: 'ecohub06@gmail.com',
                to: email,
                subject: 'Reset Password',
                text: `Please click on the link to reset your password: ${resetLink}. The link expires in 30 minutes`
            };
            await transporter.sendMail(mailOptions);
            return res.render('./users/response', {
                layout: 'login',
                title: 'EcoHub | Forgot password',
                msg: 'Password reset link sent successfully to your email'
            });
        } catch (e){
            return res.status(500).json({error: e});
        }
    })

router
    .route('/reset-password')
    .get(async (req, res) => {
        const {token} = req.query;
        try{
            const user = await User.findOne({
                resetToken: token, 
                resetTokenExpiry: {$gt: Date.now()}
            });
            if(!user){
                return res.status(404).json({error: 'Invalid token or expired'});
            }

            return res.render('./users/reset-password', {
                title: 'EcoHub | Reset Password',
                layout: 'login', 
                token
            })
        } catch(e){
            return res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const { password, confirmPassword, token } = req.body;
        try {
            if (password !== confirmPassword) {
                return res.render('./users/reset-password', {
                    layout: 'login',
                    title: 'EcoHub | Reset Password',
                    hasError: true,
                    error: "Passwords don't match",
                    token
                });
            }
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(404).json({ error: 'Invalid token or expired' });
            }
            await User.updateOne(
                { _id: user._id },
                {
                    $set: { password: password }, 
                    $unset: { resetToken: "", resetTokenExpiry: "" }
                },
                { runValidators: true } 
            );

            return res.status(200).render('./users/response', {
                layout: 'login',
                title: 'EcoHub | Reset Password',
                hasResponse: true,
                msg: 'Password reset successfully',
                token
            });
    
        } catch (e) {

            if (e.name === 'ValidationError') {
                const errorDetails = e.message.replace('Validation failed:', '').trim();
                const passwordError = errorDetails
                    .split(',')
                    .find(err => err.trim().startsWith('password:'));
                const errorMessage = passwordError ? passwordError.trim() : 'An error occurred.';

                return res.render('./users/reset-password', {
                    layout: 'login',
                    title: 'EcoHub | Reset Password',
                    hasError: true,
                    error: errorMessage,
                    token
                });
            }
            return res.status(500).json({ error: e.message });
        }
    });
    
export default router;  