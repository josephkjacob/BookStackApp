const mongoose = require("mongoose");
var registerSchema = new mongoose.Schema({
    Name:String,
    Email:String,
    Password:String,
    Contact:Number,
    Gender:String,
    Country:String,
    Postal:String,
    Image:{default:""}
})
var registerModel = mongoose.model("register", registerSchema, "users");

module.exports = registerModel;