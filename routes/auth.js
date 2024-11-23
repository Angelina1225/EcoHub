import { Router } from 'express';
import passport from 'passport';
const router = Router();

router
    .route('/google')
    .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
    .route('/google/callback')
    .get(passport.authenticate('google',
        { failureRedirect: '/' }),
        (req, res) => {
            res.redirect('/home')
        })

router
    .route('/logout')
    .get((req, res, next) => {
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/')
        })
    })

export default router;