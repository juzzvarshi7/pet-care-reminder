
const mongoose = require("mongoose");
module.exports = mongoose.model("Pet",
  new mongoose.Schema({ name:String, type:String, userId:String })
);
