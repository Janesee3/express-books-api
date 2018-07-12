const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors");

// Open DB connection
mongoose.connect("mongodb://localhost/jumpstart");
const db = mongoose.connection;
db.on("error", error => {
	console.error("An error occurred!", error);
});

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const author1 = new Author({
//     name: "JK Rowling",
//     age: 45
// })

// const author2 = new Author({
//     name: "Ms Cat",
//     age: 10
// })

// author1.save();
// author2.save();

app.use("/", index);
app.use("/books", books);
app.use("/authors", authors)

module.exports = app;
