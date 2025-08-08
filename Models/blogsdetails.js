const mongoose = require('mongoose');

const subsectionSchema = new mongoose.Schema({
  subheading: String,
  content: String
});

const sectionSchema = new mongoose.Schema({
  heading: String,
  content: String,
  subsections: [subsectionSchema]
});

const relatedBlogSchema = new mongoose.Schema({
  title: String,
  img: String,
  intro: String
});

const blogSchema = new mongoose.Schema({
  title: String,
  img: String,
  author: String,
  published_date: String,
  intro: String,
  sections: [sectionSchema],
  related_blogs: [relatedBlogSchema]
});

const blogsDetailsSchema = new mongoose.Schema({
  name: String, 
  blogs: [blogSchema]
});

module.exports = mongoose.model('BlogsDetails', blogsDetailsSchema);
