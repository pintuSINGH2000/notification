const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const authRoute = require("./routes/user");
const notificationRoute = require("./routes/notification");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/notification",notificationRoute);

PORT = 8000;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
