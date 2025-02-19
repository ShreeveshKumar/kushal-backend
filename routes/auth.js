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


router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  console.log(email, password, role);


  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5h' });

    res.status(200).json({ success: true, message: 'Login successful', user: { token, email, role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

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

router.post("/validate", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(tokendecoded);

  tokendecoded ? res.status(200).json({ valid: true, loggedin: true }) : res.status(433).json({ valid: false, loggedin: false });


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


router.post("/update-task", (req, res) => {
  try {

  } catch (err) {
    console.log(err);
  }
})


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



router.post('/validate', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = users.find(user => user.id === decoded.id);
    if (user) {
      return res.status(200).json({ isLoggedIn: true });
    } else {
      return res.status(401).json({ isLoggedIn: false });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;
