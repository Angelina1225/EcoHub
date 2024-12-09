import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    body: {
        type: String,
        required: true,
    },
    truncatedBody: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '/public/images/placeholder.png',
    },
    urlFormat: {
        type: String,
    }
},
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogPostSchema);
export default Blog;