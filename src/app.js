const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User.js");

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  try {
    await user.save();
    res.send("User Added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

// getting user by email Id using get request :
app.get("/userdataByEmail", async (req, res) => {
  const userMail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userMail });
    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// getting user if two users have same emailId
app.get("/user", async (req, res) => {
  const userMail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userMail });
    if (!users) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// getting all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete a user by id
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    console.log(user)
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// partial update a user by patch
app.patch("/patch", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId)
  const data = req.body;
  console.log(data)
  try {
    await User.findByIdAndUpdate( userId , data); 
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
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
