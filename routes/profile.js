import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { User } from '../models/User.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../public/images/profile-images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, and PNG images are allowed'))
        }
    }
});

router.route('/')
    .get((req, res) => {
        const user = req.session.user;

        if (!user) {
            return res.redirect('/signin');
        }

        return res.render('./users/profile', {
            layout: 'main',
            title: `${user.firstName} ${user.lastName} - Profile | EcoHub`,
            user: user,
            editMode: false
        });
    });

router.route('/edit')
    .get((req, res) => {
        const user = req.session.user;

        if (!user) {
            return res.redirect('/signin');
        }

        return res.render('./users/profile', {
            layout: 'main',
            title: `${user.firstName} ${user.lastName} - Profile | EcoHub`,
            user: user,
            editMode: true
        });
    });

router.route('/update')
    .post(upload.single('image'), async (req, res) => {
        try {
            const user = req.session.user;

            if (!user) {
                return res.redirect('/signin');
            }

            const { firstName, lastName, email, password } = req.body;
            let image = user.image;

            if (req.file) {
                image = `/public/images/profile-images/${req.file.filename}`;
            }

            const updatedFields = {};
            updatedFields.userName = user.userName;

            if (firstName && firstName !== user.firstName) {
                updatedFields.firstName = firstName;
            }

            if (lastName && lastName !== user.lastName) {
                updatedFields.lastName = lastName;
            }

            if (email && email !== user.email) {
                updatedFields.email = email;
            }

            if (password && password != user.password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedFields.password = hashedPassword;
            }

            if (image && image !== user.image) {
                updatedFields.image = image;
            }

            const updatedUser = await User.findOneAndUpdate(
                { email: user.email },
                updatedFields,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(400).send('User not found');
            }

            req.session.user = updatedUser;

            return res.redirect('/profile');
        } catch (error) {
            return res.status(500).json({ error: e });
        }
    });

export default router;