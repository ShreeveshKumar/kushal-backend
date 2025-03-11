const express = require("express");
const feedbackModal = require("../models/feedbackModel");
const userModel = require("../models/userModel");

exports.apprating = async (req, res) => {
    const { email } = req.user;
    const { feedback, rating } = req.body;
    try {
        if (!email || !feedback || !rating) {
            return res.status(404).json("Fill required columns");
        }

        const isuser = await userModel.findOne({ email });

        if (!isuser) {
            return res.status(404).json("No users found please register first");
        }

        const userfeed = new feedbackModal({ userid: isuser._id, feedback: feedback, rating: rating });
        await userfeed.save();
        return res.status(200).json({ message: "Feedback recorded successfully" })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Some error occured please try again", err })

    }
}

exports.washerfeedback = async (req, res) => {
    const { email } = req.user;
    const { washerid, feedback, rating } = req.body;
    try {

        if (!washerid || !feedback || !rating) {
            return res.status(400).json({ message: "All fields are required: washerid, feedback, rating" });
        }

        const allRatings = await UserRating.find({ washerid });

        const totalRatings = allRatings.length;
        const sumRatings = allRatings.reduce((sum, entry) => sum + entry.rating, 0);
        const overallRating = totalRatings ? (sumRatings / totalRatings).toFixed(2) : rating;

        return res.status(200).json({
            message: "Feedback submitted successfully",
            overallRating: Number(overallRating),
        });

    } catch (err) {
        return res.status(500).json({ message: "Some error occurred", error: err.message });
    }
};