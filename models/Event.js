import mongoose from 'mongoose';

// Address schema definition
const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minLength: [5, 'Length of Address must be 5 characters or longer'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        minLength: [2, 'Length of city must be 2 characters or longer'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        uppercase: true,
        minLength: [2, 'Required 2 character state abbreviation'],
        maxLength: [2, 'Required 2 character state abbreviation'],
    },
    zip: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
        minLength: [5, 'Zip code should be 5 digits long'],
        maxLength: [5, 'Zip code should be 5 digits long'],
    },
    formatted: {
        type: String,
    },
},
    { _id: false }
);

const participantSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to User
    userName: { type: String, required: true },
    email: { type: String, required: true },
    isVolunteer: { type: Boolean, default: false },
});

// Event schema definition
const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: [true, 'Title is required'],
            minLength: [2, 'Length of title must be 2 characters or longer'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minLength: [5, 'Length of description must be 5 characters or longer'],
            trim: true,
        },
        specialConditions: {
            type: String,
            trim: true,
            required: false
        },
        eventDate: {
            type: Date,
            required: [true, 'Event date is required'],
            validate: {
                validator: (date) => date > Date.now(),
                message: 'Event date must be in the future',
            },
        },
        place: {
            type: addressSchema,
            required: [true, 'Event location is required'],
        },
        requiredVolunteer: {
            type: Number,
            required: [true, 'Number of volunteers needed cannot be negative'],
            min: 0,
        },
        participants: { 
            type: [participantSchema],
            default: undefined 
        },
    },
    { timestamps: true }
);

addressSchema.pre('save', function (next) {
    this.formatted = `${this.address}, ${this.city}, ${this.state}, ${this.zip}`;
    next();
});

eventSchema.virtual('availableVolunteers').get(function () {
    const volunteers = this.participants.filter((p) => p.isVolunteer).length;
    return this.requiredVolunteer - volunteers;
});

export default Event = mongoose.model('Event', eventSchema);;