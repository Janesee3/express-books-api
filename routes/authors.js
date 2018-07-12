const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

router.get("/", async (req, res, next) => {
	const authors = await Author.find();
	res.json(authors);
});

router.get("/:id", async (req, res, next) => {
	try {
		const author = await Author.findById(req.params.id);
		const booksWritten = await Book.find({ author: req.params.id });
		res.json({
			...author.toJSON(),
			books: booksWritten
		});
	} catch (err) {
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	const newAuthor = new Author({
		name: req.body.name,
		age: req.body.age
	});

	try {
		await newAuthor.save();
		res.status(201).json({ message: "Successfully created new author" });
	} catch (err) { // mongoose error returns an object which contains 'errors'. key name is the attribute that has the error.
		// console.log(err.errors["age"]);
		if (err.name === "ValidationError")
			return handleError(res, 400, err.message);
		next(err);
	}
});

const handleError = (res, status, msg) => {
	res.status(status).json({ message: msg });
	return;
};

module.exports = router;
