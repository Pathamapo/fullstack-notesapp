const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
	title: String,
	createdAt: { type: Date, default: Date.now },
	content: String,
	userId: mongoose.Schema.Types.ObjectId,
});

const Note = mongoose.model('note', notesSchema);
module.exports = Note;
