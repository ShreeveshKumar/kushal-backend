const vehicleModal = require("../models/vehicleModal");


exports.addvehicle = async (req, res) => {
    const {
        name,
        licenseNumber,
        make,
        model,
        year,
        color,
        type,
        lastServiced,
        servicePackage,
        mileage,
        fuelType,
        fromState,
        description
    } = req.body;

    const { email } = req.user;
    console.log(req.body, email);

    try {
        if (!name || !licenseNumber || !make || !model || !year || !color || !type || !lastServiced || !mileage || !fuelType || !fromState || !description) {
            return res.status(400).json({ message: "Not all fields are added" });
        }

        const isvehicle = await vehicleModal.findOne({ licenseNumber });

        if (isvehicle) {
            return res.status(400).json({ message: "Vehicle with that license number already exists" });
        }

        const newvehicle = new vehicleModal({
            name,
            licenseNumber,
            make,
            model,
            year,
            color,
            type,
            lastServiced,
            servicePackage,
            mileage,
            fuelType,
            fromState,
            description
        });

        await newvehicle.save();

        return res.status(200).json({ message: "Vehicle added successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Vehicle is not added", err });
    }
};


exports.viewvehicle = async (req, res) => {
    const { email } = req.user;
    console.log(email);

    try {
        const isvehicle = await vehicleModal.findOne({ user: email });

        if (!isvehicle) {
            return res.status(400).json({ message: "No vehicle found" });
        }

        const getvehicles = await vehicleModal.find({}, { _id: 0, user: 0 });
        return res.status(200).json({ message: "All vehicles fetched successfully", vehicles: getvehicles });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Some error occured", err });
    }
}