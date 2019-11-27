var fs = require("fs");
var users = [];
var books = [];
var authors = [];



function addUser(data){
    users.push(data);
    storeUsers();
}
function addBook(data){
    console.log("addingBook in userData", data);
    books.push(data);
    storeBooks();
   
}
function addAuthor(data){
    authors.push(data);
    storeAuthors();
}

function jParse(data){
    return JSON.parse(JSON.stringify(data));
}


function loadBooks(){
    fs.readFile("./src/data/books.json", "utf-8", (err, data) =>{
        if(err) throw err;
        else books = jParse(data);
        console.log("--------",books, "------------");
    });
}
function loadAuthors(){
    fs.readFile("./src/data/authors.json", "utf-8", (err, data) =>{
        if(err) throw err
        else authors = jParse(data);
    });
}
function loadUsers(){
    fs.readFile("./src/data/users.json", "utf-8", (err, data) =>{
        if(err) throw err;
        else users = jParse(data);
        console.log("--------",users, "------------");
    });
}

function storeBooks(){
    fs.writeFile("./src/data/books.json", JSON.stringify(books), "utf-8", (err) => {
        if (err) throw err;
        else console.log("Successfully stored book in json file");
    })
}
function storeAuthors(){
    fs.writeFile("./src/data/authors.json", JSON.stringify(authors), "utf-8", (err) => {
        if (err) throw err;
        else console.log("Successfully stored author in json file");
    })
}
function storeUsers(){
    fs.writeFile("./src/data/users.json", JSON.stringify(users), "utf-8", (err) => {
        if (err) throw err;
        else console.log("Successfully stored user in json file");
    })
}
loadUsers();
loadBooks();
loadAuthors();





module.exports.addUser = addUser;
module.exports.addBook = addBook;
module.exports.addAuthor = addAuthor;
module.exports.authors = authors;
module.exports.books = books;
module.exports.users = users;
module.exports.content = {books, authors, users};