import userRoutes from './users.js';
import authRoutes from './auth.js';
import eventRoutes from './events.js';
import blogRoutes from './blogs.js';

import { static as staticDir } from 'express';

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/events', eventRoutes);
    app.use('/auth', authRoutes);
    app.use('/blogs', blogRoutes);
    app.use('/public', staticDir('public'));
    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;