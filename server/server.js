const express = require("express");
const cors = require("cors");
const app = express();
const transactionRoutes = require("./routes/transactionRoutes")
const connectDB = require("./config/mongoDB");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const PORT = process.env.PORT || 8001;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/v1/transaction", transactionRoutes)
app.get("/", (req, res) => {
  res.json({ message: "Server is up 🚀" });
});
app.use(errorHandler)
app.get("/health", (req, res) => {
  res.json({
    message: "Server is healthy 💪",
    signal: "🟢",
    status: 200,
    time: new Date().toUTCString(),
  });
});


connectDB();
app.listen(PORT, (err) => {
  if (!err) {
    console.log(` 🚀 Server is up on PORT http://localhost:${PORT}`);
  }
});