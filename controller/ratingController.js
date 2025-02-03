const express = require("express");
const feedbackModal = require("../models/feedbackModel");

module.exports = async (req, res) => {
    const { feedback, rating } = req.body;
    try {
        const userfeed = new feedbackModal({ feedback: feedback, rating: rating });
        await userfeed.save();
    } catch (err) {
        console.log(err.message);
    }
}