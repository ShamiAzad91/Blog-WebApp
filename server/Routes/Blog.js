const Blog = require("../Models/BlogSchema");
const express = require("express");
const router = express.Router();
const User = require("../Models/UserSchema");
const authTokenHandler = require("../Middlewares/checkAuthToken");

const checkBlogOwnerShip = async(req,res,next)=>{
  try {
    const blog = await Blog.findById(req.params.id);
    if(!blog){
      // return res.status(404).json({message:'blog post not found'})
      return res.status(404).json(createResponse(false, 'Blog post not found'));
    }
    if(blog.owner.toString() !== req.userId){
      // return res.status(403).json({message:'Permission denied: You donot own the blog'})
      return res.status(403).json(createResponse(false, 'Permission denied: You do not own this blog'));

    }
    req.blog = blog;
    next();
    
  } catch (err) {
    // return res.status(500) .json({ message: "Something went Wrong", err: err.message ,err:err.stack});
    res.status(500).json(createResponse(false, err.message));
  }
}
router.get("/test", authTokenHandler, (req, res) => {
  res.json({
    message: "test api for  works for blogs",
    userId: req.userId,
  });
});

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

//create new Blog
router.post("/create", authTokenHandler, async (req, res) => {
  try {
    const { title, description, imageUrl, paragraphs,category } = req.body;
    const blog = new Blog({
      title,
      description,
      imageUrl,
      paragraphs,
      owner: req.userId,
      category
    });
    await blog.save();
   const user = await User.findById(req.userId);
   if(!user){
  //  return res .status(404).json({ message:"user not found" });
  return res.status(404).json(createResponse(false, 'User not found'));
   }

   user.blogs.push(blog._id);
   await user.save();

  //  res.status(201).json({message:'Blog created successfully',blog})
  return res .status(201).json(createResponse(true,'Blog created successfully'));


  } catch (err) {
    // return res  .status(500).json({ message: "Something went Wrong", err: err.message ,err:err.stack});

  return res .status(500).json(createResponse(false,'Something went Wrong'));

  }
});

 // Get all blog posts
 router.get('/', async (req, res) => {
  try {
      const search = req.body.search || ''; // Default to an empty string if 'search' is not provided
      const page = parseInt(req.body.page) || 1; // Default to page 1 if 'page' is not provided or is invalid
      const perPage = 10; // Number of blogs per page

      // Build the search query using regular expressions for case-insensitive search
      const searchQuery = new RegExp(search, 'i');

      // Count the total number of blogs that match the search query
      const totalBlogs = await Blog.countDocuments({ title: searchQuery });

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalBlogs / perPage);

      // Ensure 'page' is within valid range
      if (page < 1 || page > totalPages) {
          // return res.status(400).json({message:'invalid page Number'});
         res .status(400).json(createResponse(false,'invalid page Number'));

      }

      // Calculate the number of blogs to skip
      const skip = (page - 1) * perPage;

      // Fetch the blogs that match the search query for the specified page
      const blogs = await Blog.find({ title: searchQuery })
          .sort({ createdAt: -1 }) // Sort by the latest blogs
          .skip(skip)
          .limit(perPage);
  // res.status(200).json({message:'Blogs fetched successfully',blogs, totalPages, currentPage: page})
  res.status(200).json(createResponse(true, 'Blogs fetched successfully', { blogs, totalPages, currentPage: page }));

  } catch (err) {
    res.status(500).json(createResponse(false, err.message));
  }
});

//single blog
// Get a specific blog post by ID
router.get('/single/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json(createResponse(false, 'Invalid blog ID'));
    }
    const blog = await Blog.findById(id);
      if (!blog) {
          return res.status(404).json(createResponse(false, 'Blog post not found'));
      }
      // Send success response


    res.status(200).json(createResponse(true, 'Blog fetched successfully', { blog }));

    
  } catch (err) {
      res.status(500).json(createResponse(false, err.message));
  }
});
  
//update blog
  router.put("/update/:id",authTokenHandler,checkBlogOwnerShip, async (req, res) => {
    try {
      const {title,description,imageUrl,paragraphs} = req.body;
      const updateBlog = await Blog.findByIdAndUpdate(req.params.id,{
        title,description,imageUrl,paragraphs
      },{new:true});
      if(!updateBlog){
      // return res.status(404).json({message:'Blog not updated'})
      return res.status(404).json(createResponse(false, 'Blog post not found'));

      }
      // return res.status(200).json({message:'Blog post updated successfully',updateBlog});
      res.status(200).json(createResponse(true, 'Blog post updated successfully', { updateBlog }));

    
    } catch (err) {
      // return res .status(500)  .json({ message: "Something went Wrong", err: err.message ,err:err.stack});
      res.status(500).json(createResponse(false, err.message));
    }
  });
  
//delete blog
  router.delete("/remove/:id",authTokenHandler,checkBlogOwnerShip, async (req, res) => {
    try {

      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
      if(!deletedBlog){
      // return res.status(404).json({message:'Blog post  not found'})
      return res.status(404).json(createResponse(false, 'Blog post not found'));
      }
       
      const user = await User.findById(req.userId);
      if(!user){
        // return res.status(404).json({message:'user not found'})
        return res.status(404).json(createResponse(false, 'User not found'));
        }
        const blogIndex = user.blogs.indexOf(req.params.id);
        if (blogIndex !== -1) {
            user.blogs.splice(blogIndex, 1);
            await user.save();
        }


        res.status(200).json(createResponse(true, 'Blog post deleted successfully'));

    
    } catch (err) {
      // return res .status(500)  .json({ message: "Something went Wrong", err: err.message ,err:err.stack});
      res.status(500).json(createResponse(false, err.message));
    }
  });



  
module.exports = router;
