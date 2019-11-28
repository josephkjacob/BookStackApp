const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const authorModel = require("../../model/authorModel");
const multer = require("multer");
const path = require("path");
const authorsRouter = express.Router();

//var url = "mongodb://127.0.0.1:27017/sampledb";
var url ="mongodb+srv://jo_ict:Jose2962@cluster0-pdsf9.mongodb.net/sampledb?retryWrites=true&w=majority";
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
var authors = [
    /* {
         name:"M. T. Vasudevan Nair",
         book:"Randamuzham",
         award:"Padma Bhushan",
         image:"/images/mt.jpg"
     },
     {
         name:"Chetan Bhagat",
         book:"2 States",
         award:"Filmfare Award",
         image:"/images/chetan.jpg"
     },
     {
         name:"A P J Abdul Kalam",
         book:"Wings of Fire",
         award:"Bharat Ratna",
         image:"/images/wingsoffire.jpg"
     },
     {
         name:"J. K. Rowling",
         book:"Harry Potter",
         award:"Kids’ Choice Award for Favorite Book",
         image:"/images/rj.jpg"
     },*/
];
/*fs.readFile("./authors.json", "utf-8", (err, data) => {
    if(err) throw err;
    else authors = JSON.parse(data);
})*/
function router(nav) {
    authorsRouter.route("/")
        .get((req, res) => {
            /*res.render("authors.ejs",
                {
                    nav: nav,
                    title: 'Authors',
                    authors: authors
                })*/
            loadAuthorsPage(res);
        });
    authorsRouter.get("/img/:id", (req, res) => {
        /* res.sendFile(express.static(path.join(__dirname, "../../uploads/undefined_undefined.jpg")));*/
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
            /*authors.push(req.body);
            res.render("authors.ejs",{
                nav,
                title: "Authors",
                authors
            });
            saveAuthors();*/
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
            /*  var id = req.params.id; // or  req.param[id]
              res.render("author.ejs",
                  {
                      nav: nav,
                      title: 'Author',
                      author: authors[id]
                  });*/
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
            /*var id = req.params.id;
            authors.splice(id, 1);
            res.render("authors.ejs",
                {
                    nav,
                    title: "Authors",
                    authors
                })
            saveAuthors();*/
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

function saveAuthors() {
    /*fs.writeFile("./authors.json",  JSON.stringify(authors), "utf-8", (err) =>{
        if(err) throw err;
        else console.log("Saved Authors information");
    });*/
}
/*app.get("/authors", (req, res) => {
    res.render("authors.ejs",
    {

    });
});*/
module.exports = router;