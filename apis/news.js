const express = require('express');
const newsRouter = express.Router();
const News = require('../Models/news.js');
newsRouter.post("/addnews", async (req, res) => {
    try {
        const newNews = new News(req.body);
        const savedNews = await newNews.save();
        res.json({
            message: "News added successfully",
            data: savedNews
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

newsRouter.get("/getnews", async (req, res) => {
    try {
        const newsData = await News.find();
        res.json({
                message: "News fetched successfully",
            data: newsData
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
});

module.exports = newsRouter;