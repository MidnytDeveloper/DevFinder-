const express = require("express");
const app = express();

const { adminAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/user", (req, res) => {
  res.send("user data");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.get("/admin/DeleteUser", (req, res) => {
  res.send("user Deleted");
});

app.listen(3000, () => {
  console.log("server is created successfully and listen on port 3000");
});
