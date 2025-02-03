const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    formData: {
        specialArea: { type: String, required: true },
        day: { type: String, required: true },
        slot: { type: String, default: null },
        occurrence: { type: String, default: null },
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    washerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending',
    },
    // scheduleTime: {
    //     type: Date,
    //     required: true,
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


module.exports = mongoose.model("tasks", taskSchema);