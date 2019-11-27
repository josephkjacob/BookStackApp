const express = require("express");
const chalk = require("chalk");
const path = require("path");
const bodyParse = require("body-parser");

var app = new express();
var nav = [{link:'/books', title:'Books',books:[]}, {link:'/authors', title:'Authors'}, {link:'/books/add', title:'AddBook'}, {link:'/authors/add', title:'AddAuthor'},{link:'/signup', title:'SignUp'},{link:'/signup/login', title:'LogIn'}];
var booksRouter = require("./src/routes/booksRouter.js")(nav);
var authorsRouter = require("./src/routes/authorsRouter.js")(nav);
var signupRouter = require("./src/routes/signupRouter")(nav);

app.use(express.static(path.join(__dirname,"public")));
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(bodyParse.urlencoded({extended:true}));
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/signup", signupRouter);
/*app.use(bodyParse.json());*/
 

app.get("/", function(req, res){


   res.render(
       'index.ejs',
       {
           nav:nav,
           title:'Library'
       }
   );
});



app.listen(3000, () => {
    console.log("listerning to port " + chalk.green('3000'));
});

