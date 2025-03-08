const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    couponCode: {
        type: String,
        unique: true
    },
    verified: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("payments", paymentSchema);
