const mongoose = require("mongoose");
var bookSchema = new mongoose.Schema({
    Title:String,
    Author:String,
    Genre:String,
    Description:String,
    Image:String
});

var bookModel = mongoose.model("books", bookSchema, "books");


module.exports = bookModel;