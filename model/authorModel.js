const mongoose = require("mongoose");
var authorSchema = new mongoose.Schema({
    Name:String,
    Books:Array,
    Awards:Array,
    Description:String,
    Image:String
});

var authorModel = mongoose.model("author", authorSchema, "authors");
module.exports = authorModel;