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

mongoose.connect("mongodb+srv://anshikashivhare102_db_user:eksrca6r8WJSTwB@cluster0.jhxqz1t.mongodb.net/musicApp?retryWrites=true&w=majority")
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
============================*/


mongoose.connect("mongodb+srv://shivuser:Shiv%4012345@cluster0.jhxqz1t.mongodb.net/musicApp?retryWrites=true&w=majority")
.then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 3000, () => {
        console.log("Server running");
    });
})
.catch(err => console.log(err));