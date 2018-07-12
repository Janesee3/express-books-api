const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const mongoose = require("mongoose");

/* GET books listing. */
router.get("/", async (req, res, next) => {
	try {
		const books = await Book.find().populate("author"); // 'author' here refers to the KEY name inside the Book model!
		res.json(books);
	} catch (err) {
		next(err);
	}
});

// ...authors.toJSON() --> destructure but wihtout the mongo attributes

router.get("/:id", async (req, res, next) => {
	try {
		let book = await Book.findById(req.params.id).populate("author");
		if (!book) return handleError(res, 404, "Cannot find book with this id!");
		res.json(book);
	} catch (err) {
		// TODO: REFACTOR THIS!!
		if (err.name === "CastError" && err.kind === "ObjectId")
			return handleError(res, 404, "Cannot find book with this id!");
		next(err);
	}
});

router.post("/", async (req, res, next) => {
	const newBook = new Book({
		title: req.body.title,
		author: req.body.author
	});

	try {
		let book = await newBook.save();
		res.status(201).json({ message: `Successfully created a new book.` });
	} catch (err) {
    
    // We should just handle the error at parent level and send the message there
    // the rest just send to next middleware
    
    // parent error
    // err instanceof mongoose.Error.ValidationError --> true
    
    // Child error 'author'
		let error = err.errors["author"];

		// Handle the error when the id is not correct format
		if (error instanceof mongoose.CastError) {
			return handleError(res, 400, "Author id is invalid!");
		}

		if (error instanceof mongoose.Error.ValidatorError) {
			console.log(error.name);
			return handleError(res, 400, error.message);
		}

		next(err);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		let book = await Book.findByIdAndUpdate(req.params.id, req.body);
		if (!book) {
			return handleError(
				res,
				404,
				`cannot find book with id ${req.params.id}.`
			);
		}
		res.json({ message: `updated book with id ${req.params.id}.` });
	} catch (err) {
		next(err);
	}
});

router.delete("/:id", (req, res, next) => {
	// another way to do this (delete will NOT execute if u dont attach a callback to the args!)
	let delQuery = Book.findByIdAndDelete(req.params.id);
	delQuery.exec((err, book) => {
		// this is an async function ! we can await it
		if (err) next(err);
		if (!book) {
			return handleError(
				res,
				404,
				`cannot find book with id ${req.params.id}.`
			);
		}
		res.json({ message: `delete book with id ${req.params.id}.` });
	});
});

const handleError = (res, status, msg) => {
	res.status(status).json({ message: msg });
	return;
};

module.exports = router;
