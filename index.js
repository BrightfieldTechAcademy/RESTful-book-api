// const http = require('http')
// const url = require('url')
const fs = require('fs')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { log } = require('console')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.status(200).send('<h1>Welcome to my Awesome books<h1>')
} )

app.get('/books', (req, res) => {
    fs.readFile('books.json', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        res.write(data)
        res.end()
    })
})

app.get('/new_book', (req, res) => {
    let formHtml = `
    <html lang="en">
        <head>
        <title>Document</title>
        </head>
        <body>
            <form action="/new_book" method="POST">
                <lable for="name">Book Name</lable>
                <input type="text" name="name" placeholder="Enter book name"><br>
                <lable for="author">Book Name</lable>
                <input type="text" name="author" placeholder="Enter book author"><br>
                <lable for="price">Book Price</lable>
                <input type="text" name="price" placeholder="Enter book price"><br>
                <input type="submit" value="submit">
            </form>
        </body>
        </html>
    `
    res.send(formHtml)
})

app.post('/new_book', (req, res) => {
    fs.readFile('books.json', (err, data) => {
        let books = JSON.parse(data)
        
        let newBook = {
            bookId: books.length + 1,
            bookName: req.body.name,
            bookAuthor: req.body.author,
            bookPrice: req.body.price
        }
        books.push(newBook)
        books = JSON.stringify(books, null, 4)
        
        fs.writeFile('books.json', books, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("Book added successfully");
        })
    })
    res.redirect('/books')
})

app.get('/books/:id', (req, res) => {
    fs.readFile('books.json', (err, data) => {
        let books = JSON.parse(data)
        let book = books[req.params.id - 1]
        res.json(book)
    })
})

app.listen(8080, () => {
    console.log('App listen in port 8080');
})