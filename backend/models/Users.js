const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
	username: {
		type: String,
		// https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
		match: [
			/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
			'Please enter a valid username',
		],
		required: [true, 'Please provide username'],
		unique: true,
	},
	emailId: {
		type: String,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please enter a valid email address',
		],
		required: [true, 'Please provide email id'],
		unique: [true, 'An account with this email already exists'],
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
	},
});

const User = mongoose.model('user', usersSchema);
module.exports = User;
