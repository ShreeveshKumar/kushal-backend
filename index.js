require('dotenv').config({
    path: "./config.env"
});
const express = require('express');
const cors = require('cors');
// const routes = require('./routes');
const connectDB = require("./config/dbconn");
const Task = require("./models/taskModel");
const http = require("http");
const path = require("path");
const rateLimit = require("express-rate-limit");
const vehicleroute = require("./routes/vehicleRoute");
const paymentroute = require("./routes/paymentRoute");
const authRoute = require("./routes/auth")
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { Server } = require("socket.io");
const cron = require("node-cron");
const { scheduledeletion } = require("./controller/userController")

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

connectDB();
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("message", (data) => {
        console.log(`Received message: ${data}`);
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Carcare Swagger API",
            version: "1.0.0",
            description: "API documentation using Swagger",
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const limiter = rateLimit({
    windowMs: 10000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Response limit reached, Please try again after some time"
})

app.use(limiter);

// app.use('/api', routes);
app.use("/api", authRoute);
app.use('/api/vehicle', vehicleroute);
app.use('/api/product', paymentroute);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.render("index", { title: "CarCare" });
})
app.get("/rating", (req, res) => {
    res.render("rating");
})

app.get("/pay", (req, res) => {
    console.log("Query Params Received:", req.query);

    const { amount, name, email, phone, type } = req.query;
    console.log("Extracted type:", type); // Add this to check

    if (!amount || !name || !email || !phone || !type) {
        console.error("Missing parameters:", { amount, name, email, phone, type });
        return res.status(400).json({ error: "Required parameters missing" });
    }

    res.render("payment", {
        amount: amount || 0,
        type: type || "default",
        name: name || "John Doe",
        email: email || "abc@example.com",
        phone: phone || "+91 9999999999",
        razorpayKey: process.env.razorpay_key
    });
});


app.get("/privacy-policy", (req, res) => {
    res.render("privacy-policy");
})

app.get("/faqs", (req, res) => {
    res.render("faq");
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



cron.schedule("0 0 * * *", async () => {
    await scheduledeletion();
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);

});
