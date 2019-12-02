const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const authorModel = require("../../model/authorModel");
const multer = require("multer");
const path = require("path");
const authorsRouter = express.Router();

var url = "mongodb://127.0.0.1:27017/sampledb";
//var url ="mongodb+srv://jo_ict:Jose2962@cluster0-pdsf9.mongodb.net/sampledb?retryWrites=true&w=majority";
var imagePath = "http://localhost:3000/authors/img/";
mongoose.connect(url, (err) => {
    if (err) throw err;
    else console.log("Author db connection is established");
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads");
    },
    filename: function (req, file, callback) {

        console.log("---------------------------------------------", req.body.name);
        var fileExt = file.originalname.split(".");
        var imageFileName = req.body.name + "." + fileExt[fileExt.length - 1];
        console.log(imageFileName, "---------------------------------------------", req.body.name);
        /*callback(null, file.originalname);*/
        callback(null, imageFileName);
    }
})
var uploads = multer({ storage: storage });

function router(nav) {
    authorsRouter.route("/")
        .get((req, res) => {           
            loadAuthorsPage(res);
        });
    authorsRouter.get("/img/:id", (req, res) => {
        console.log(path.join(__dirname, "../../uploads/" + req.params.id));
        res.sendFile(path.join(__dirname, "../uploads/" + "../../uploads/" + req.params.id));
    })
    authorsRouter.route("/add")
        .get((req, res) => {
            res.render("addAuthorForm.ejs",
                {
                    nav,
                    title: "Add Author",
                });
        })
    authorsRouter.route("/save")
        .post(uploads.single("file"), (req, res) => {
            console.log(req.body);
            var aModel = new authorModel();
            aModel.Name = req.body.name;
            aModel.Books = req.body.books.split(",");
            aModel.Awards = req.body.awards.split(",");
            aModel.Description = req.body.description;
            aModel.Image = req.file.filename;
            aModel.save((err) => {
                if (err) throw err;
                else {
                    console.log("Author details saved");
                    loadAuthorsPage(res);


                }
            })
           
        });
    authorsRouter.route('/:id')
        .get((req, res) => {
            authorModel.findOne({ _id: req.params.id }, (err, data) => {
                if (err) throw err;
                else {
                    console.log(data.Name);
                    res.render("author.ejs",
                        {
                            nav: nav,
                            title: 'Author',
                            author: data,
                            imagePath:imagePath
                        });
                }
            })
            
        });
        authorsRouter.route("/edit/:id")
        .get((req, res) =>{
            authorModel.find({ _id: req.params.id }, (err, data) => {
                console.log(data);
    
                if (err) throw err;
                else {
                    console.log(data);
                    res.render("editAuthor.ejs",
                        {
                            nav: nav,
                            title: 'Update Author Details',
                            author: data[0],
                            imagePath: imagePath
                        });
                }
            })
        });
        authorsRouter.route("/updateAuthor")
        .post((req, res) =>{
            var updatObj = {
                Name: req.body.name,
                Books: req.body.books,
                Awards: req.body.awards,
                Description: req.body.description,
                Image:req.body.image
            }
            authorModel.updateOne({_id:req.body._id}, updatObj, (err) =>{
                if(err) throw err;
                else{
                    loadAuthorsPage(res);
                }
            });
        });
    authorsRouter.route("/remove/:id")
        .get((req, res) => {
            authorModel.deleteOne({_id:req.params.id}, (err) =>{
                if(err) throw err;
                else {
                    console.log("Removed the author");
                    loadAuthorsPage(res);
                }
            });
            
        })

    function loadAuthorsPage(res) {
        authorModel.find({}, (aErr, data) => {
            if (aErr) throw aErr;
            else {
                res.render("authors.ejs", {
                    nav,
                    title: "Authors",
                    authors: data,
                    imagePath: imagePath
                });
            }
        })
    }


    return authorsRouter;
}


module.exports = router;