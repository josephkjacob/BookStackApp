const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const signupRouter = express.Router();
const registerModel = require("../../model/registerModel");
const bookModel = require("../../model/bookModel");
var url = "mongodb://127.0.0.1:27017/sampledb";
//var url ="mongodb+srv://jo_ict:Jose2962@cluster0-pdsf9.mongodb.net/sampledb?retryWrites=true&w=majority";
var imagePath = "http://localhost:3000/authors/img/";
mongoose.connect(url, (err) => {
    if (err) throw err;
    else console.log("Users db connection established");
});

function router(nav) {
    signupRouter.route("/")
        .get((req, res) => {
            res.render("signup.ejs",
                {
                    nav,
                    title: "Register"
                });
        });

    signupRouter.route("/login")
        .get((req, res) => {
            nav[nav.length - 1].title = "LogIn";
            res.render("login.ejs",
                {
                    nav,
                    title: "LogIn",
                    loginMsg: ""
                })
        });

    signupRouter.route("/login/validate")
        .post((req, res) => {
            var loginSuccess = false;
            registerModel.find({ Name: req.body.username }, (err, data) => {
                if (err) throw err;
                else {

                    for (var i = 0; i < data.length; i++) {
                        console.log(req.body.username, data[i].Name, req.body.password, data[i].Password);
                        if (req.body.username == data[i].Name && req.body.password == data[i].Password) {
                            loginSuccess = true;
                            nav[nav.length - 1].title = "LogOut";                            
                            loadBooksPage(res);
                            break;
                        }
                    }
                    if (!loginSuccess) {
                        res.render("login.ejs",
                            {
                                nav,
                                title: "LogIn",
                                loginMsg: "Missmatch Username or Password!"
                            })
                    }

                }

            })
           
        });

    signupRouter.route("/register")
    .post((req, res) =>{
        registerModel.findOne({Name:req.body.fullName}, (err, data)=>{
            if(err) throw err;
            else{
                console.log(data);
                console.log("\n\n");
                if(data == null){
                    console.log("user NOT exists");
                    var regModel = new registerModel();
                    regModel.Name = req.body.fullName;
                    regModel.Email = req.body.email;
                    regModel.Password = req.body.password;
                    regModel.Contact = req.body.contactNumber;
                    regModel.Gender = req.body.gender;
                    regModel.Country = req.body.country;
                    regModel.Postal = req.body.address;
                    regModel.Image = "";
                    regModel.save((err) => {
                        if (err) throw err;
                        else {
                            console.log("user informtion added to db");
                            loadBooksPage(res);
                        }
                    })
                }
                else if(data.Name === req.body.fullName){
                    console.log("user exists");
                    res.send("user exists");
                }

                console.log("\n\n");
            }
        });
    })
    signupRouter.route("/register_del")
        .post((req, res) => {
            console.log(req.body);
            registerModel.find({}, (err, data) => {
                if (err) throw err;
                else {
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i].Name + " ; " + req.body.fullName.toString().toLowerCase());
                        if (data[i].Name.toString().toLowerCase() == req.body.fullName.toString().toLowerCase()) {
                            console.log("user name exists");
                            res.send("User Name already taken");
                        }
                    }

                    var regModel = new registerModel();
                    regModel.Name = req.body.fullName;
                    regModel.Email = req.body.email;
                    regModel.Password = req.body.password;
                    regModel.Contact = req.body.contactNumber;
                    regModel.Gender = req.body.gender;
                    regModel.Country = req.body.country;
                    regModel.Postal = req.body.address;
                    regModel.Image = "";
                    regModel.save((err) => {
                        if (err) throw err;
                        else {
                            console.log("user informtion added to db");
                            loadBooksPage(res);
                        }
                    })
                }
            }) 
            });
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
            return signupRouter;

        }


module.exports = router;