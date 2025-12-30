
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("./db");
const User = require("./User");
const Pet = require("./Pet");
const Reminder = require("./Reminder");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth/register", async (req,res)=>{
  const hash = bcrypt.hashSync(req.body.password,10);
  const user = await User.create({email:req.body.email,password:hash});
  res.json(user);
});

app.post("/auth/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user || !bcrypt.compareSync(req.body.password,user.password))
    return res.status(401).send("Invalid");
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
  res.json({token});
});

app.get("/pets/:userId", async (req,res)=>{
  res.json(await Pet.find({userId:req.params.userId}));
});
app.post("/pets", async (req,res)=>{
  res.json(await Pet.create(req.body));
});

app.get("/reminders/:petId", async (req,res)=>{
  res.json(await Reminder.find({petId:req.params.petId}));
});
app.post("/reminders", async (req,res)=>{
  res.json(await Reminder.create(req.body));
});

app.listen(5000, ()=>console.log("Backend running"));
