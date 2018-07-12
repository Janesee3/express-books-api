const mongoose = require("mongoose");

// Schema
const authorSchema = mongoose.Schema({
	name: { type: String, required: true },
	age: { type: Number, required: true }
});

// Model
module.exports = mongoose.model("Author", authorSchema);
