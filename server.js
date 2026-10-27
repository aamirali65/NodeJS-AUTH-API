import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error(
    "MONGO_URI and JWT_SECRET must be set. Copy .env.example to .env and fill it in."
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongoDB connected successfuly"))
  .catch((error) => console.log(error));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Model code
const User = mongoose.model("User", {
  Username: String,
  Email: { type: String, unique: true },
  // bcrypt hash only — a plain-text password must never be stored here.
  Password: String,
});

// Never send the password hash back to a client.
const publicUser = (user) => ({
  id: user._id,
  Username: user.Username,
  Email: user.Email,
});

// Register Routes
app.post("/register", async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
      return res
        .status(400)
        .json({ message: "Username, Email and Password are required" });
    }

    const existing = await User.findOne({ Email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(Password, 10);
    const user = await new User({ Username, Email, Password: passwordHash }).save();

    res.status(201).json({
      message: "User Register Successfuly",
      user: publicUser(user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login Routes
app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ Email });
    const passwordMatches = user && (await bcrypt.compare(Password, user.Password));

    // Same answer for an unknown email and a wrong password.
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, Email: user.Email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed" });
  }
});

// Port listen on
app.listen(PORT, () => {
  console.log(`this Port is running on http://localhost:${PORT}/`);
});
