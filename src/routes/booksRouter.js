const express = require("express");
const booksRouter = express.Router();
const fs = require("fs");

var books = [
    /*{
        title: "Autobiography",
        genre: "Life story",
        author: "Mahathma Gandi",
        image: "/images/gandhi.jpg"
    },
    {
        title: "Wings of Fire",
        genre: "Missile man",
        author: "Dr APJ Kalaam",
        image: "/images/wingsoffire.jpg"
    },
    {
        title: "Balyakalasakhi",
        genre: "Novel",
        author: "Vaikkam Basheer",
        image: "/images/balyakala.jpg"
    },
    {
        title: "Da Vinci Code",
        genre: "Fiction",
        author: "Dan Brown",
        image: "/images/davinci.jpg"
    },
    {
        title: "Harry Potter",
        genre: "Fiction",
        author: "R J Rowling",
        image: "/images/harrypotter.jpg"
    }*/
];

fs.readFile("./books.json", "utf-8", (err, data) =>{
    if(err) throw err;
    else books = JSON.parse(data);
})


function router(nav) {
    booksRouter.route('/')
        .get((req, res) => {
            res.render("books.ejs",
                {
                    nav: nav,
                    title: 'Books',
                    books //books:books
                }
            );
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


    booksRouter.route('/:id')
        .get((req, res) => {
            var id = req.params.id; // or  req.param[id]
            res.render("book.ejs",
                {
                    nav: nav,
                    title: 'Book',
                    book: books[id]
                });
        });

    booksRouter.route('/save')
        .post((req, res) => {
            console.log(req.body);
            books.push(req.body);
            /*res.send("Successfully added your book");*/
            res.render("books.ejs",
                {
                    nav: nav,
                    title: 'Book Added',
                    books
                });
            saveBooks();
        });
        booksRouter.route("/remove/:id")
        .get((req, res) => {
            var id = req.params.id;
            books.splice(id,1);
            res.render("books.ejs",
            {
                nav,
                title: "Books",
                books
            })
            saveBooks();
        })
        
    return booksRouter;
}
function saveBooks(){
    fs.writeFile("./books.json", JSON.stringify(books), "utf-8", (err) => {
        if (err) throw err;
        else console.log("Successfully stored in json file");
    })
}

/*module.exports = booksRouter;*/
module.exports = router;