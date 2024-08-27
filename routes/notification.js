const express = require("express");
const {
  subscribeController,
  sendNotification,
} = require("../controllers/notification");
const { verifyToken } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/subscribe",verifyToken, subscribeController);
router.post("/send-notification", sendNotification);
module.exports = router;