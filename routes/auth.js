const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// const  = require('../middleware/auth');
const WashForm = require("../models/taskModel");
const taskModel = require('../models/taskModel');
// const nodemailer = require("nodemailer");
const authMiddleware = require("../middleware/auth")

const router = express.Router();

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });





router.get('/profile', authMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const userData = await User.findOne({ email: email }).select('-password -_id');;
    console.log(userData);

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const isUser = await User.findOne({ email: email });

  !isUser ? res.status(400).json({ message: "Unauthorized " }) : null;

  // const info = await transporter.sendMail({
  //   from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
  //   to: {email}, // list of receivers
  //   subject: "Hello from Carcare", // Subject line
  //   text: "Your code to reset your password is ", // plain text body
  //   html: "<b>Hello world?</b>", // html body
  // });

})


router.post("/scheduletask", async (req, res) => {
  try {
    const decodedUser = req.user;
    const { slot, specialArea } = req.body;
    const userinfo = await User.findOne({ email: decodedUser.email });
    userinfo ? console.log("done") : console.log("not done");
    const newtask = new taskModel({ ownerId: userinfo._id, description: specialArea, scheduleTime: slot });
    await newtask.save();
    res.status(200).json({ success: true, message: 'Form saved successfully' });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.get("/getowner", async (req, res) => {
  try {
    const decodedUser = req.user;
    const userEmail = decodedUser.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const userId = user._id;

    const tasks = await taskModel.findOne({ ownerId: userId });

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email: userEmail,
      },
      tasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.get("/get-info-owner", authMiddleware, async (req, res) => {
  const { email } = req.user;
  try {
    const ifuser = await User.findOne({ email });

    if (ifuser) {
      return res.status(200).json({ success: true, data: ifuser });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.get("/get-washer", async (req, res) => {
  try {
    const users = await User.find({ role: "washer" }).select('-password -createdAt  -email -updatedAt -role ');
    console.log(users);
    return res.status(200).json({ message: "All washers feteched successfully", users });
  } catch (err) {
    return res.status(500).json({ messgae: `Error occured ${err.message}` })
  }
})



router.post("/user/post-task", async (req, res) => {
  const { formData, washerId, ownerId } = req.body;
  console.log(formData, washerId, ownerId);
  try {


    if (!formData || !washerId || !ownerId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newBooking = new taskModel({
      formData,
      washerId,
      ownerId,
    });

    await newBooking.save();
    res.status(200).json({ message: 'Booking saved successfully.', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
})


router.get("/user/get-tasks", authMiddleware, async (req, res) => {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const tasks = await taskModel.find({ ownerId: user._id }).select(" -updatedAt -ownerId -_id");
    console.log(tasks);


    return res.status(200).json({ message: "User tasks fetched successfully", tasks });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
