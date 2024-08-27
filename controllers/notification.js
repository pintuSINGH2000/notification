const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const { notificationQueue } = require("../helper/notificationQueue");

const subscribeController = async (req, res) => {
  try {
    const { notificationType } = req.body;
    const creator = req.creator;
    // Validate notificationType
    const NotificationType = Object.freeze({
      EMAIL: "EMAIL",
      SMS: "SMS",
      PUSH: "PUSH",
    });
    if (!Object.values(NotificationType).includes(notificationType)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }
    console.log(creator);
    const subscription = await prisma.subscription.create({
      data: { userId: creator, type: notificationType },
    });
    res
      .status(201)
      .json({ message: "Subscription added successfully", subscription });
  } catch (error) {
    res.status(500).json({ message: "Error adding subscription", error });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Retrieve all subscriptions
    const subscriptions = await prisma.subscription.findMany();
    console.log(subscriptions);
    // Enqueue a notification job for each subscribed user
      for (const subscription of subscriptions) {
      await notificationQueue.add('sendNotification', {
        userId: subscription.userId,
        message,
        type: subscription.type,
      });
    }

    res
      .status(200)
      .json({ message: "Notifications enqueued for all subscribed users" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error sending notifications", details: error.message });
  }
};

module.exports = {
  subscribeController,
  sendNotification
};
