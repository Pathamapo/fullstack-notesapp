const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	username: {
		type: String,
		match: [
			/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
			'Please enter a valid username',
		],
		required: [true, 'Please provide username'],
		unique: true,
		trim: true,
	},

	emailId: {
		type: String,
		match: [
			/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
			'Please enter a valid email address',
		],
		required: [true, 'Please provide email id'],
		unique: true,
		lowercase: true,
		trim: true,
	},

	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: [6, 'Password must be at least 6 characters'],
	},
},
{
	timestamps: true, // เพิ่ม createdAt, updatedAt
});

const User = mongoose.model('User', usersSchema);

module.exports = User;
