const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    vehiclename: {
        type: String,
        required: true
    },
    license: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lastserviced: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model("vehicles", vehicleSchema); 