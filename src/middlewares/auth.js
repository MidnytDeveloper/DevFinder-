const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token is not valid!!!!");
    }

    const decodedObj = await jwt.verify(token, "DEV@Finder$790");
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;
    
    next();
  } catch (err) {
    res.status(404).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
