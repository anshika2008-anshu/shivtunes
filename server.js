const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   MongoDB Connection
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/musicApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =========================
   User Model
========================= */

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String
});

/* =========================
   Register API
========================= */

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("User Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.send("Registered Successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/* =========================
   Login API
========================= */

app.post("/login", async (req, res) => {
  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.send("User Not Found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.send("Success");
    } else {
      return res.send("Wrong Password");
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

/* =========================
   Server Start
========================= */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
