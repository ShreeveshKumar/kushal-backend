const express = require("express");
const paymentModal = require("../models/paymentModal");
const crypto = require("crypto");
const userModal = require("../models/userModel");

const handlePayment = async ({ paymentid }) => {
    try {
        const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${process.env.razorpay_key}:${process.env.key_secret}`).toString("base64")
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch payment details:", error);
        return null;
    }
};

exports.createCoupon = async (req, res) => {
    const { paymentid, userEmail, type } = req.body;

    try {
        const isuser = await userModal.findOne({ email: userEmail });

        if (!isuser) {
            return res.status(404).json({ message: "User not found" });
        }


        const paymentDetails = await handlePayment({ paymentid });

        if (!paymentDetails || !paymentDetails.id) {
            return res.status(500).json({ message: "Failed to fetch payment details" });
        }

        const existingPayment = await paymentModal.findOne({ paymentId: paymentDetails.id });
        if (existingPayment) {
            return res.status(400).json({ message: "Payment already processed" });
        }

        const couponCode = `COUPON-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        const newPayment = new paymentModal({
            ownerId: isuser._id,
            paymentId: paymentDetails.id,
            category: type,
            amount: paymentDetails.amount / 100,
            status: "pending",
            verified: paymentDetails.captured,
            couponCode
        });


        const withcoupon = await userModal.findOneAndUpdate({ email: userEmail }, { $set: { "coupons.minisuv": isuser.coupons.minisuv += 1 } });
        await withcoupon.save();

        return res.status(200).json({ message: "Coupon created successfully", couponCode });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({ message: "Error occurred", error });
    }
};



exports.seeHistory = async (req, res) => {
    const { email } = req.user;
    try {
        if (!email) {
            return res.status(404).json({ message: "No user found" });
        }

        const isuser = await userModal.findOne({ email });

        if (!isuser) {
            return res.status(404).json({ message: "No user found" });
        }

        const paymenthist = await paymentModal.find({ ownerId: isuser._id }).sort({ createdAt: -1 });

        return res.status(200).json({ message: "payment details fetched successfyully", paymenthist });
    } catch (err) {
        return res.status(500).json({ message: "an Error occured", err })
    }
}


