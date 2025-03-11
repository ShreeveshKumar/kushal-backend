const { default: sendMail } = require("../config/mailconfig");
const userModel = require("../models/userModel");
const otpModel = require("../models/forgotPasswordModel");

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Please provide an email." });
        }

        const isUser = await userModel.findOne({ email });

        if (!isUser) {
            return res.status(404).json({ message: "No user found" });
        }

        const sixDigitNumber = Math.floor(100000 + Math.random() * 900000);

        const deviceInfo = {
            userAgent: req.headers["user-agent"],
            ip: req.ip || req.connection.remoteAddress
        };

        const newOtp = new otpModel({
            userId: isUser._id,
            otp: sixDigitNumber,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            deviceInfo: deviceInfo
        });

        await newOtp.save();

        await sendMail("Reset your password", `Your verification code is ${sixDigitNumber}`, email);
        return res.status(200).json({ message: "OTP sent for verification." });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred. Please try again later.", error: err.message });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const latestOtp = await otpModel.findOne({ userId: user._id }).sort({ createdAt: -1 });

        if (!latestOtp) {
            return res.status(400).json({ message: "No OTP found or expired." });
        }

        if (latestOtp.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP has expired." });
        }

        if (latestOtp.otp !== parseInt(otp)) {
            latestOtp.attempts++;
            new latestOtp.save();
            return res.status(400).json({ message: "Invalid OTP." });
        }

        await otpModel.deleteOne({ _id: latestOtp._id });

        return res.status(200).json({ message: "OTP verified successfully." });

    } catch (err) {
        return res.status(500).json({ message: "An error occurred. Please try again.", error: err.message });
    }
};

module.exports = async (req, res) => {
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
};


exports.signup = async (req, res) => {
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
};

