require('dotenv').config({
    path: "./config.env"
});
const express = require('express');
const cors = require('cors');
const routes = require('./routes/auth');
const connectDB = require("./config/dbconn");
const Task = require("./models/taskModel");
const http = require("http");
const path = require("path");
const vehicleroute = require("./routes/vehicleRoute");

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


connectDB();

app.use('/api', routes);
app.use('/api/vehicle', vehicleroute);


app.get("/", (req, res) => {
    res.render("index", { title: "CarCare" });
})
app.get("/rating", (req, res) => {
    res.render("rating");
})


app.get("/pay", (req, res) => {
    const { amount, name, email, phone } = req.query;
    if (!amount || !name || !email || !phone) {
        console.error("Amount or user information is missing.");
        return;
    }
    res.render("payment", { amount: amount || 0, name: name || "JOhn Doe", email: email || "abc@example.com", phone: phone || "+91 9999999999", razorpayKey: process.env.razorpay_key });
})


app.get('/faq', (req, res) => {
    const faqs = [
        { question: "How do I book a car wash?", answer: "You can book a car wash through our app by selecting a service, choosing a washer, and confirming the booking." },
        { question: "What payment methods are accepted?", answer: "We accept credit/debit cards, UPI, and digital wallets for secure payments." },
        { question: "Can I cancel a booking?", answer: "Yes, you can cancel a booking up to 30 minutes before the scheduled wash. A cancellation fee may apply." },
        { question: "How do I become a washer on the platform?", answer: "You can register as a washer in the app by providing your details, service area, and verification documents." },
        { question: "What if my car is damaged during a wash?", answer: "We ensure trained professionals handle your car. In case of any damage, please report it through the app for resolution." },
        { question: "Is there a subscription plan for regular washes?", answer: "Yes, we offer monthly and yearly subscription plans for discounted washes." },
        { question: "Do washers bring their own cleaning supplies?", answer: "Yes, our washers bring high-quality cleaning products and equipment for each wash." }
    ];

    res.render('faq', { faqs });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
