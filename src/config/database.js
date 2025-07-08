const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishekNodeCluster:abhisheknodecluster@abhisheknodecluster.1x9xmkp.mongodb.net/abhisheknodecluster"
  );
};

module.exports = connectDB;
