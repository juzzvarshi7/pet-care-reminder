
const mongoose = require("mongoose");
module.exports = mongoose.model("Reminder",
  new mongoose.Schema({ petId:String, note:String, date:String })
);
