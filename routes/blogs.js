import { Router } from 'express';
const router = Router();
import {Blog} from '../models/Blogs.js';

router
    .route('/allBlogs')
    .get(async (req, res) => {
    try {
      const blogPosts = await Blog.find().lean();
      const encodeURIComponentHelper = (str) => encodeURIComponent(str);

      res.render('./blogs/allBlogs', { 
        blogPosts, 
        helpers: { 
          encodeURIComponent: encodeURIComponentHelper 
        }
      });
    //   res.render('./blogs/allBlogs', { blogPosts });
    } catch (error) {
      res.status(500).send('Server Error');
    }
});

router
.route('/:title')    
.get(async (req, res) => {
    try {
        const blog = await Blog.findOne({ 
            title: new RegExp(`^${req.params.title}$`, 'i')
          }).lean();
      //console.log(blog);
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      // let formattedBody = blog.body
      //   .replace(/(\d+)\.\s/g, '</ol><ol><li>$1. ') 
      //   .replace(/<\/ol><ol>/, '<ol>') 
      //   .replace(/\n/g, '<br>')    
      //   .replace(/<\/ol><ol>/g, ''); 

      let formattedBody = blog.body
    .replace(/(\d+)\.\s/g, '</ol><ol><li>$1. ') 
    .replace(/<\/ol><ol>/, '<ol>') 
    .replace(/\n/g, '</p><p><br>')    // Add a <br> between <p> tags
    .replace(/<\/ol><ol>/g, '') 
    .replace(/^<p>/, '')  // Remove the first <p> tag (before the first paragraph)
    .replace(/<\/p>$/, '');  // Remove the last </p> tag (after the last paragraph)

      formattedBody = formattedBody.trim(); 
      blog.formattedBody = formattedBody;
      res.render('./blogs/blogDetails', { blog });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  
export default router;  