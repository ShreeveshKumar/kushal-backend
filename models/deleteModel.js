const mongoose = require("mongoose");

const deleteSchema = mongoose.Schema({
    data: {
        type: JSON,
        required: true
    },
    date: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model("deletedAccounts", deleteSchema); 