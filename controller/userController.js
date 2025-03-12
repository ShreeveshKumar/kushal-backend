const userModal = require("../models/userModel");
const deleteModal = require("../models/deleteModel");
const userModel = require("../models/userModel");
const emailQueue = require("./scheduleController");


exports.deleteaccount = async (req, res) => {
    const { email } = req.user;
    try {

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const isuser = await userModal.findOne({ email: email });

        if (!isuser) {
            return res.status(404).json({ message: "No user found" });
        }

        const datenow = new Date();
        const deletionDate = new Date();
        deletionDate.setDate(datenow.getDate() + 15);
        const deluser = new deleteModal({ data: isuser.toObject(), date: deletionDate });
        await deluser.save();

        await emailQueue("senddeleteMail", { email });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Some error occured", err });
    }
}

exports.deactivateaccount = async (req, res) => {
    const { email } = req.user;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const isuser = await userModal.findOne({ email: email });
        if (!isuser) {
            return res.status(404).json({ message: "No user found" });
        }

        isuser.accounttype = 'inactive';

        await emailQueue.add('sendinactiveMail', { email });
        await isuser.save();
        return res.status(200).json({ message: "User Deactivated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "An error occured", err });
    }

}

exports.scheduledeletion = async (req, res) => {
    try {

        const toDate = new Date();

        const alldeletions = await deleteModal.find({ date: { $lte: new Date() } });

        if (!alldeletions) {
            return res.status(200).json({ message: "No users to delete today" });
        }

        const allusers = alldeletions.map((user) => user.data._id);


        await userModal.deleteMany({ _id: allusers });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Some error occured please check !", err });
    }
}


exports.getvouchers = async (req, res) => {
    const { email } = req.user;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const isuser = await userModel.find({ email });

        if (!isuser) {
            return res.staus(404).json({ message: "No relevant info or user found" });
        }

        return res.status(200).json({ message: "All vouchers fetched", vouchers: isuser.coupons })
    } catch (err) {
        return res.status(500).json({ message: "Some error occured ", err })
    }
}



exports.userprofile = async (req, res) => {
    const { email } = req.user;
    try {
        const userData = await userModal.findOne({ email: email }).select('-password -_id');;
        console.log(userData);

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
