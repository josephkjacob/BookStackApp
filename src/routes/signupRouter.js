const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const signupRouter = express.Router();
const registerModel = require("../../model/registerModel");
var url = "mongodb://127.0.0.1:27017/sampledb";

mongoose.connect(url, (err) => {
    if (err) throw err;
    else console.log("Users db connection established");
});
var books = [];
var users = [
    /*{
        fullName: 'Admin',
        email: 'admin@admin.com',
        password: '12345',
        confirmPassword: '12345',
        contactNumber: '9696969696',
        gender: 'male',
        country: 'India',
        address: 'Great'
    }*/
]
/*fs.readFile("./users.json", "utf-8", (err, data) => {
    if(err) throw err;
    else users = JSON.parse(data);
})
fs.readFile("./books.json", "utf-8", (err, data) =>{
    if(err) throw err;
    else books = JSON.parse(data);
   
})*/
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
                            res.render("books.ejs",
                                {
                                    nav,
                                    title: "Library",
                                    books: books
                                });
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

            /* var success = validateUser(req.body);
             if(success){
                 nav[nav.length - 1].title = "LogOut";
                 res.render("books.ejs",
                 {
                     nav,
                     title: "Library",
                     books:books
                 })
             }
             else{
                 res.render("login.ejs",
                 {
                     nav,
                     title: "LogIn",
                     loginMsg: "Missmatch Username or Password!"
                 })
             }*/
        });
    signupRouter.route("/register")
        .post((req, res) => {
            console.log(req.body);
            /*var exist = verifyUserExist(req.body)
            if(!exist){
                return false;
            }*/
            users.push(req.body);
            console.log("-------------", users, "-----------")
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
                else console.log("user informtion added to db");
            })

            res.render("books.ejs",
                {
                    nav,
                    title: "Libarary",
                    books: books
                });
            // saveUsers();
        });
    return signupRouter;

}
function validateUser(data) {
    /* var success = false;   
     users.forEach(element => {
         if(data.username.toString.toLowerCase == element.fullName.toString.toLowerCase && data.password == element.password){     
             console.log("login success");  
             success = true;
             return;           
         }        
     });     
     if(success){
         console.log("---   login success"); 
         return true;
     } 
     else{
         console.log("username or password missmatch"); 
          
     }    
     return false;*/
}
function verifyUserExist(data) {
    var exist = false;
    users.forEach(element => {
        if (data.fullName.toString.toLowerCase == element.fullName.toString.toLowerCase) {
            exist = true;
            return;
        }
    })
    return exist;
}

function saveUsers() {
    /* fs.writeFile("./users.json", JSON.stringify(users), "utf-8", (err) => {
         if(err) throw err;
         console.log("User data saved");
     })*/
}
module.exports = router;