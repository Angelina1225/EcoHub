import mongoose from 'mongoose';
const { Schema, model } = mongoose;

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
    
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  });

blogPostSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Blog = model('Blog', blogPostSchema);
export default { Blog };