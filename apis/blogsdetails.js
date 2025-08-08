const express = require('express');
const blogsRoute = express.Router();
const Blogs = require('../Models/blogsdetails');

blogsRoute.post("/blogsdetails", async (req, res) => {
    try {
        const newBlog = new Blogs(req.body);
        const savedBlog = await newBlog.save();
        res.json({
            message: "Blog details added successfully",
            data: savedBlog
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

blogsRoute.get("/getblogdetails", async (req, res) => {
    try {
        const blogs = await Blogs.find();
        res.json({
            message: "All Blogs details fetched successfully",
            data: blogs
        });
        console.log(res['data'], 'data...')
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

blogsRoute.get("/getblogdetailsPagination", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    // Fetch all categories
    const allCategories = await BlogsDetails.find();

    // Flatten all blogs into a single array
    const allBlogs = allCategories.flatMap(category =>
      category.blogs.map(blog => ({
        ...blog.toObject(),
        category: category.name // optional: keep category info
      }))
    );

    const totalBlogs = allBlogs.length;
    const paginatedBlogs = allBlogs.slice(skip, skip + limit);

    res.json({
      page,
      limit,
      totalItems: totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
      data: paginatedBlogs
    });
  } catch (err) {
    console.error('Error fetching paginated blogs:', err);
    res.status(500).json({ error: 'Server error' });
  }
})

module.exports = blogsRoute;