const mongoose = require("mongoose");

const feedbackModal = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
    },
    feedback: {
        type: String,
    },
    rating: {
        type: Number,
    }
});

module.exports = mongoose.model("feedback",feedbackModal);