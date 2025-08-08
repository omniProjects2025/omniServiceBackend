const express = require("express");
const userRouter = express.Router();
const User = require("../Models/user");

userRouter.post("/signup", async (req, res) => {
  console.log(req,'req...');
  console.log(res,'res.....');
  try {
    const { fullName, emailId, phoneNumber, location, department, message } = req.body;

    // Split fullName into firstName and lastName
    const nameParts = fullName?.trim().split(" ");
    const firstName = nameParts?.[0] || "";

    const user = new User({
      firstName,
      emailId,
      phoneNumber,
      location,
      department,
      message
    });

    const newUser = await user.save();
    res.json({
      message: "User added successfully",
      data: newUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
});


userRouter.get("/getusers", async (req, res) => {
  console.log(req, 'req..');

  try {
    const userData = await User.find();
    res.json({
      message: "I have got all user",
      userData
    })
  }
  catch (err) { 
    console.error(err);
  }
})

userRouter.get("/getuserbyid", async (req, res) => {
  try {
  const { emailId } = req.query;

    const findUser = await User.findOne({ emailId });

    res.json({
      message: "I have got the user",
      findUser
    })
  }
  catch (err) {
    console.error(err);
  }
})

module.exports = userRouter;

