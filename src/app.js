const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const User = require("./models/User.js");
const { validateSignUpData } = require("./Utils/Validation.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// SignUp Api-----------------------------------------------------------
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("ERROR : " + err.message);
  }
});

// LogIn Api-----------------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create a JWT token
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Profile Api-----------------------------------------------------------
app.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(req);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Connection Api
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent a connection request");
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("server is created successfully and listen on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected");
  });
