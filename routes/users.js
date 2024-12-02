import { Router } from 'express';
import { User } from '../models/User.js';
import Event from '../models/Event.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            // Get user session
            const user = req.session.user;

            // Get 4 upcoming events
            let upcomingEvents = await Event.find({ eventDate: { $gt: new Date() } }).sort({ eventDate: 1 }).limit(4);
            upcomingEvents.forEach(event => {
                event.eventDateformatted = event.eventDate.toLocaleDateString('en-Us', {
                    month: 'long',
                    day: '2-digit',
                    year: 'numeric',
                });
            });

            return res.render('./users/home', {
                layout: 'main',
                title: 'EcoHub',
                upcomingEvents: upcomingEvents,
                user: user
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/signin')
    .get(async (req, res) => {
        try {
            const user = req.session.user;

            if (user) {
                return res.render('./users/home', {
                    layout: 'main',
                    title: 'EcoHub',
                    user: user
                });
            }

            return res.render('./users/login', {
                layout: 'login',
                title: 'Sign In | EcoHub'
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        try {
            const passwordMatch = await user.comparePassword(password);

            if (!user || !passwordMatch) {
                return res.render('./users/login', {
                    layout: 'login',
                    title: 'Sign In | EcoHub',
                    hasError: true,
                    error: "Invalid email or password",
                    user: {
                        email,
                        password
                    }
                });
            }

            req.session.user = user;

            return res.redirect('/');
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router.route('/signup')
    .get(async (req, res) => {
        try {
            const user = req.session.user;

            if (user) {
                return res.render('./users/home', {
                    layout: 'main',
                    title: 'EcoHub',
                    user: user
                });
            }

            return res.render('./users/signup', {
                layout: 'login',
                title: 'Sign Up | EcoHub'
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        let { firstName, lastName, userName, email, password, confirmPassword } = req.body;
        const userInfo = {
            firstName,
            lastName,
            email,
            userName,
            password,
            confirmPassword
        };

        if (password !== confirmPassword) {
            return res.render('./users/signup', {
                layout: 'login',
                title: 'Sign Up | EcoHub',
                hasError: true,
                error: "Passwords must match",
                passwordMatchError: true,
                userInfo
            });
        }

        try {
            let user = await User.findOne({ email: email });

            if (user) {
                return res.render('./users/signup', {
                    layout: 'login',
                    title: 'Sign Up | EcoHub',
                    hasError: true,
                    error: "User already registered with this email",
                    emailExist: true,
                    userInfo
                });
            } else {
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
                email = email.toLowerCase();
                userName = userName.toLowerCase();

                const newUser = { firstName, lastName, userName, email, password };
                user = await User.create(newUser);
                return res.redirect('/signin');
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const eMsg = Object.values(err.errors).map((e) => e.message).join(', ');

                return res.render('./users/signup', {
                    layout: 'login',
                    title: 'Sign Up | EcoHub',
                    hasError: true,
                    error: eMsg,
                    userInfo
                });
            }
            console.log(err)
            if (err.code === 11000) {
                return res.render('./users/signup', {
                    layout: 'login',
                    title: 'Sign Up | EcoHub',
                    hasError: true,
                    error: 'Username or email already exists',
                    userInfo
                });
            }
        }
    });

router.route('/logout')
    .get((req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            return res.redirect('/signin');
        });
    });

router.route('/reset')
    .get(async (req, res) => {
        try {
            const user = req.session.user;

            if (user) {
                return res.render('./users/home', {
                    layout: 'main',
                    title: 'EcoHub',
                    user: user
                });
            }

            return res.render('./users/reset', {
                layout: 'login',
                title: 'Forgot password | EcoHub'
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        const { email } = req.body;
        let user = await User.findOne({ email: email });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

        try {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await User.findOneAndUpdate(
                { email: email },
                {
                    $set: {
                        resetToken: resetToken,
                        resetTokenExpiry: resetTokenExpiry
                    }
                }
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
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })

router.route('/reset-password')
    .get(async (req, res) => {
        const { token } = req.query;
        try {
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(404).json({ error: 'Invalid token or expired' });
            }

            return res.render('./users/reset-password', {
                title: 'Reset Password | EcoHub',
                layout: 'login',
                token
            })
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {
        const { password, confirmPassword, token } = req.body;
        try {
            if (password !== confirmPassword) {
                return res.render('./users/reset-password', {
                    layout: 'login',
                    title: 'Reset Password | EcoHub',
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
                title: 'Reset Password | EcoHub',
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
                    title: 'Reset Password | EcoHub',
                    hasError: true,
                    error: errorMessage,
                    token
                });
            }
            return res.status(500).json({ error: e.message });
        }
    });

export default router;