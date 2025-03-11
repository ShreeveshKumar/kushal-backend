const taskModel = require("../models/taskModel");
const User = require("../models/userModel");

exports.scheduleTask = async (req, res) => {
    try {
        const decodedUser = req.user;
        const { slot, specialArea } = req.body;

        const userinfo = await User.findOne({ email: decodedUser.email });

        if (!userinfo) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newTask = new taskModel({
            ownerId: userinfo._id,
            description: specialArea,
            scheduleTime: slot
        });

        await newTask.save();
        res.status(200).json({ success: true, message: 'Task scheduled successfully' });
    } catch (error) {
        console.error('Error scheduling task:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getWashers = async (req, res) => {
    try {
        const washers = await User.find({ role: "washer" }).select('-password -createdAt -email -updatedAt -role');
        return res.status(200).json({ message: "All washers fetched successfully", washers });
    } catch (err) {
        console.error('Error fetching washers:', err);
        return res.status(500).json({ message: `Error occurred: ${err.message}` });
    }
};
exports.postTask = async (req, res) => {
    const { formData, washerId, ownerId } = req.body;

    if (!formData || !washerId || !ownerId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newBooking = new taskModel({
            formData,
            washerId,
            ownerId
        });

        await newBooking.save();
        res.status(200).json({ message: 'Booking saved successfully.', booking: newBooking });
    } catch (error) {
        console.error('Error posting task:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

exports.getUserTasks = async (req, res) => {
    const { email } = req.user;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const tasks = await taskModel.find({ ownerId: user._id }).select("-updatedAt -ownerId -_id");

        return res.status(200).json({ message: "User tasks fetched successfully", tasks });
    } catch (err) {
        console.error('Error fetching user tasks:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
