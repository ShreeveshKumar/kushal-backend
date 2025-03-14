const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    lastServiced: { type: String, required: true },
    mileage: { type: String, required: true },
    fuelType: { type: String, required: true },
    fromState: { type: String, required: true },
    description: { type: String, required: false }
}, { timestamps: true });


module.exports = mongoose.model("vehicles", vehicleSchema); 