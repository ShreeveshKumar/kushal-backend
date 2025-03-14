require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const http = require("http");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Server } = require("socket.io");
const cron = require("node-cron");
const connectDB = require("./config/dbconn");
const { scheduledeletion } = require("./controller/userController");
const { Queue, Worker } = require('bullmq');

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const vehicleRoute = require("./routes/vehicleRoute");
const paymentRoute = require("./routes/paymentRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const ratingRoute = require("./routes/feedbackRoute");
const taskRoute = require("./routes/taskRoute");

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

connectDB();
const connection = { url: process.env.REDIS_URL };

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later."
});
app.use(limiter);

const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("message", (data) => {
        io.emit("message", data);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CarCare API",
            version: "1.0.0",
            description: "API documentation for CarCare",
        },
        servers: [{ url: `http://localhost:${PORT}`, description: "Local server" }],
    },
    apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/ratings", ratingRoute);
app.use("/api/v1/vehicle", vehicleRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/feedback", feedbackRoute);
app.use("/api/v1/task", taskRoute);


app.get("/", (req, res) => res.render("index", { title: "CarCare" }));
app.get("/privacy-policy", (req, res) => res.render("privacy-policy"));
app.get("/faqs", (req, res) => {
    const faqs = [
        { question: "How do I book a car wash?", answer: "Use our app to book a service." },
        { question: "What payment methods are accepted?", answer: "Credit/debit cards, UPI, digital wallets." },
        { question: "Can I cancel a booking?", answer: "Yes, up to 30 minutes before the service." },
        { question: "How do I become a washer?", answer: "Register in the app with required details." },
        { question: "What if my car is damaged?", answer: "Report it through the app for resolution." },
    ];
    res.render("faq", { faqs });
});

app.get("/pay", (req, res) => {
    const { amount, name, email, phone, type } = req.query;
    if (!amount || !name || !email || !phone || !type) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    res.render("payment", {
        amount,
        type,
        name,
        email,
        phone,
        razorpayKey: process.env.RAZORPAY_KEY,
    });
});

cron.schedule("0 0 * * *", async () => {
    await scheduledeletion();
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Docs available at http://localhost:${PORT}/api/v1/docs`);
});
