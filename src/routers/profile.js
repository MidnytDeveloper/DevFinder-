const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ValidateEditProfileData } = require("../Utils/Validation");
const profileRouter = express.Router();

// Profile View
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    console.log(req);
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Profile Edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }
    // console.log("req object--------------" , req)
    
    const loggedInUser = req.user;
    console.log(loggedInUser);
    console.log("req body--------------" , req.body)


    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(loggedInUser);

    // loggedInUser[key] = req.body[key]
    // This line is copying values from the request body into the user document, replacing any existing values that match the same keys.

    // Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // is to update the user’s profile data with the new values sent by the client (like frontend or Postman).

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} ,Profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
