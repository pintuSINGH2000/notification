const { hashPassword, comparePassword } = require("../helper/hashPassword");
const { PrismaClient } = require("@prisma/client");
const JWT = require("jsonwebtoken");
const prisma = new PrismaClient();

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usernameRegex = /^[A-Za-z\s]+$/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (
      !name ||
      !email ||
      !password ||
      !usernameRegex.test(name.trim()) ||
      !emailRegex.test(email.trim()) ||
      !passwordRegex.test(password.trim())
    ) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).send({ errorMessage: "User already exists" });
    }

    const hashedPassword = await hashPassword(password.trim());
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).send({ message: "Register Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ errorMessage: "Bad request" });
    }

    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(409).send({ errorMessage: "User doesn't exist" });
    }
    const check = await comparePassword(password.trim(), user.password);
    if (!check) {
      return res.status(401).send({ errorMessage: "Invalid credentials" });
    }
    if (!check) {
      return res.status(401).send({ errorMessage: "Invalid credentials" });
    }

    // Generate JWT token
    const token = JWT.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: "60h",
    });

    res.status(200).send({
      message: "Login successfully",
      token,
      name: user.username,
      userId: user.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};

module.exports = {
  registerController,
  loginController,
};
