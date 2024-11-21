import mongoose from 'mongoose';
import { validateEmailAddress, validatePassword } from '../validators/validation.js';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

// User schema definition
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minLength: [2, 'Length of first name must be 2 characters or longer'],
        trim: true,
        validate: {
            validator: (firstName) => {
                const regex = /\d+/;
                return !regex.test(firstName);
            },
            message: 'First name cannot contain numbers',
        },
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minLength: [2, 'Length of last name must be 2 characters or longer'],
        trim: true,
        validate: {
            validator: (lastName) => {
                const regex = /\d+/;
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
                validator: async (email) => {
                    const count = await model('User').countDocuments({
                        email: email,
                    });
                    return !count;
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
        lowercase: true,
        unique: true,
        trim: true,
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters or numbers'],
        minLength: [5, 'Length of username must be 5 characters or longer'],
        validate: {
            validator: async (userName) => {
                const count = await model('User').countDocuments({
                    userName: userName,
                });
                return !count;
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
            message:
                'Must contain an upper case letter\n' +
                '\t  Must contain a lower case letter\n' +
                '\t  Must contain a special chacterter\n' +
                '\t  Must contain a number\n' +
                '\t  Must be 8 characters or longer',
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
    createAt: {
        type: Date,
        default: Date.now
    }
    // volunteerHours: {
    //     type: Number,
    //     default: 0,
    //     min: [0, 'Volunteer hours need to be a positive number'],
    //     validate: {
    //         validator: (hours) => {
    //             return Number.isInteger(hours);
    //         },
    //         message: 'Volunteer hours need to be an integer',
    //     },
    // },
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
    createAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

googleUserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Compile User model
export const User = model('User', userSchema);
export const GoogleUser = model('GoogleUser', googleUserSchema);

export default { User, GoogleUser };