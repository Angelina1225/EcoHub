import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GoogleUser } from '../models/User.js';

async function configurePassport(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
    },
        async (accessToken, refreshToken, profile, cb) => {
            const newGoogleUser = {
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            };

            try {
                let user = await GoogleUser.findOne({ googleId: profile.id });
                if (user) {
                    cb(null, user)
                } else {
                    user = await GoogleUser.create(newGoogleUser);
                    cb(null, user);
                }
            } catch (e) {
                console.log(e);
            }
        }
    ));

    passport.serializeUser((user, cb) => {
        process.nextTick(() => {
            cb(null, user.id);
        });
    });

    passport.deserializeUser((user, cb) => {
        process.nextTick(() => {
            cb(null, user);
        });
    });
}

export default configurePassport;