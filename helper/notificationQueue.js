// queue.js
const { Queue, Worker, QueueScheduler } = require("bullmq");
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const IORedis = require("ioredis");

const connection = new IORedis('redis://red-cr6svql6l47c739ajb3g:6379', {
  maxRetriesPerRequest: null, 
  enableReadyCheck: false,   
});

connection.on("connect", () => {
  console.log("Connected to Redis");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const prisma = new PrismaClient();

// Create a queue
const notificationQueue = new Queue("notifications", {
  connection: connection,
});

// Define a worker to process the queue
const worker = new Worker(
  "notifications",
  async (job) => {
    const { userId, message, type } = job.data;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (type === "EMAIL") {
      const transporter = await nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      // Send email
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Notification",
        text: message,
      };
      const res = await transporter.sendMail(mailOptions);
    } else if (type === "SMS") {
    //  when user provide number then we can sms notification
    } else if (type === "PUSH") {
      // here when client side generate deviceToken then we can use push notification
    }

    return { status: "Notification sent" };
  },
  { connection }
);


module.exports = { notificationQueue };
