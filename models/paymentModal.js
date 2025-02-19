const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true,
    },
    washerId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: Boolean,
        default: true,
        required: true,
    }
})

module.exports = mongoose.model("payments", paymentSchema);