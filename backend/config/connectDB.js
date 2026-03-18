const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_DB_URI);
	console.log('MongoDB connected');
};

module.exports = connectDB;