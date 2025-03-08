const userModal = require("../models/userModel");
const deleteModal = require("../models/deleteModel");


exports.deleteaccount = async (req, res) => {
    const { email } = req.user;
    try {

        const isuser = await userModal.findOne({ email: email });

        if (!isuser) {
            return res.status(404).json({ message: "No user found" });
        }

        const deluser = new deleteModal({ data: isuser });
        await deluser.save();

        const isdeleted = await userModal.findOneAndDelete({email:email}); 
        return res.status(200).json({message:"User deleted successfully",isdeleted}); 
    } catch (err) {
        return res.status(500).json({ message: "Some error occured", err });
    }
}