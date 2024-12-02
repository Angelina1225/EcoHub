import mongoose from 'mongoose';
import { validateEmailAddress, validatePassword } from '../validators/validation.js';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minLength: [2, 'First name must be at least 2 characters'],
        trim: true,
        validate: {
            validator: (firstName) => {
                const regex = /\d/;
                return !regex.test(firstName);
            },
            message: 'First name cannot contain numbers',
        },
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minLength: [2, 'Last name must be at least 2 characters'],
        trim: true,
        validate: {
            validator: (lastName) => {
                const regex = /\d/;
                return !regex.test(lastName);
            },
            message: 'Last name cannot contain numbers',
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        unique: true,
        trim: true,
        validate: [
            {
                validator: async function (email) {
                    const count = await mongoose.model('User').countDocuments({
                        email: email,
                    });
                    return count === 0;
                },
                message: 'User already exists with this email',
            },
            {
                validator: (email) => {
                    return validateEmailAddress(email);
                },
                message: 'Email must be a valid email address',
            },
        ],
    },
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters or numbers'],
        minLength: [5, 'Username must be at least 5 characters'],
        validate: {
            validator: async function (userName) {
                const count = await mongoose.model('User').countDocuments({
                    userName: userName,
                });
                return count === 0;
            },
            message: 'Username is already taken',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        validate: {
            validator: (password) => {
                return validatePassword(password);
            },
            message: 'Password does not meet the requirement',
        },
    },
    image: {
        type: String,
        default: '/public/images/default.png'
    },
    role: {
        type: String,
        default: 'user',
    },
},
    { timestamps: true }
);

const googleUserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: [true, 'Google ID is required'],
        trim: true,
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
    },
},
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            console.error('Error hashing password:', error);
        }
    }

    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
    try {
        const passwordMatch = await bcrypt.compare(password, this.password);
        return passwordMatch;
    } catch (error) {
        console.error('Error comparing password:', error);
    }
};

// Compile User model
export const User = mongoose.model('User', userSchema);
export const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

export default { User, GoogleUser };