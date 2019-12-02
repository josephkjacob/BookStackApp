const express = require("express");
const booksRouter = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const bookModel = require("../../model/bookModel");
var url = "mongodb://127.0.0.1:27017/sampledb";
//var url ="mongodb+srv://jo_ict:Jose2962@cluster0-pdsf9.mongodb.net/sampledb?retryWrites=true&w=majority";

var imagePath = "http://localhost:3000/authors/img/";
mongoose.connect(url, (err) => {
    if (err) throw err;
    else {
        console.log("books db connection is established")
    }
})

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads");
    },
    filename: function (req, file, callback) {

        var fileExt = file.originalname.split(".");
        var imageFileName = req.body.title + "." + fileExt[fileExt.length - 1];
        /*callback(null, file.originalname);*/
        callback(null, imageFileName);
    }
})

var uploads = multer({ storage: storage });



function router(nav) {
    booksRouter.route('/')
        .get((req, res) => {
            bookModel.find({}, (err, data) => {
                if (err) throw err;
                else {
                    
                    loadBooksPage(res);
                }
            });
            
        });
    booksRouter.route('/updateBook')
        .post((req, res) => {

            var updateObj = {
                Title: req.body.title, 
                Author: req.body.author, 
                Genre: req.body.genre, 
                Description: req.body.description, 
                Image:req.body.image
            };
            bookModel.updateOne({_id:req.body._id }, updateObj, (err) => {
                if (err) throw err;
                else {
                    ////////
                    bookModel.find({_id: req.body._id}, (er, data) => {
                        if (er) throw er;
                        else loadBooksPage(res);                            
                    });
                    ////////////
                }
            })

        
        
        });
booksRouter.route('/add')
    .get((req, res) => {
        res.render("addForm.ejs",
            {
                nav: nav,
                title: 'AddBook'

            }
        );
    });
booksRouter.get("/img/:id", (req, res) => {
    console.log(path.join(__dirname, "../../uploads/" + req.params.id));
    res.sendFile(path.join(__dirname, "../uploads/" + "../../uploads/" + req.params.id));
})

booksRouter.route('/:id')
    .get((req, res) => {
        bookModel.find({ _id: req.params.id }, (err, data) => {
            if (err) throw err;
            else {
                console.log(data);
                res.render("book.ejs",
                    {
                        nav: nav,
                        title: 'Book',
                        book: data[0],
                        imagePath: imagePath
                    });
            }
        });
        
    });

booksRouter.route('/save')
    .post(uploads.single("imageFile"), (req, res) => {
        var bModel = new bookModel();
        bModel.Title = req.body.title;
        bModel.Author = req.body.author;
        bModel.Genre = req.body.genre;
        bModel.Description = req.body.description;
        bModel.Image = req.file.filename;
        bModel.save((err) => {
            if (err) err;
            else {
                console.log("Book information added to db");
                loadBooksPage(res);
            }
        });
       
    });

booksRouter.route("/remove/:id")
    .get((req, res) => {

        bookModel.deleteOne({_id:req.params.id}, (err) =>{
            if(err) throw err;
            else loadBooksPage(res);
        })
        
        
    })
booksRouter.route("/edit/:id")
    .get((req, res) => {
        bookModel.find({ _id: req.params.id }, (err, data) => {
            console.log(data);

            if (err) throw err;
            else {
                console.log(data);
                res.render("editBook.ejs",
                    {
                        nav: nav,
                        title: 'Update Book Details',
                        book: data[0],
                        imagePath: imagePath
                    });
            }
        })

    })



function loadBooksPage(res) {
    bookModel.find({}, (aErr, data) => {
        if (aErr) throw aErr;
        else {
            res.render("books.ejs", {
                nav,
                title: "Books",
                books: data,
                imagePath: imagePath
            });
        }
    })
}
return booksRouter;
}

function saveBooks() {
    fs.writeFile("./books.json", JSON.stringify(books), "utf-8", (err) => {
        if (err) throw err;
        else console.log("Successfully stored in json file");
    })
}

/*module.exports = booksRouter;*/
module.exports = router;