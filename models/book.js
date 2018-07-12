const mongoose = require("mongoose");
const Author = require("../models/author");

// Schema
const bookSchema = mongoose.Schema({
	title: { type: String, required: [true, "Title is required!"] },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Author", // String must be the same as the string in Author model!
		required: [true, "Author id is required!"],
		validate: {
			validator: author => {
				console.log("Hello");
				return Author.findById(author); // returns false if cant find such author with this id
			},
			message: "Author id not found."
		}
	}
});

bookSchema.methods.getInfo = function() {
	console.log(
		`The book title is ${this.title}, and it is written by ${this.author}.`
	);
};

// Model
const book = mongoose.model("Book", bookSchema);

module.exports = book;
