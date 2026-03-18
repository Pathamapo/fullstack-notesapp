const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const usersRoute = require('./routes/users');
const notesRoute = require('./routes/notes');

const connectDB = require('./config/connectDB');

// ENV
dotenv.config();

require('./config/passport');

const app = express();


// ======================
// ✅ Connect database
// ======================
if (!process.env.MONGO_DB_URI) {
	console.error('❌ MONGO_URI is missing in .env');
	process.exit(1);
}
connectDB();


// ======================
// ✅ Body parser
// ======================
app.use(express.json());


// ======================
// ✅ CORS
// ======================
app.use(cors({
	origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	credentials: true
}));


// ======================
// ✅ Security
// ======================
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());


// ======================
// ✅ Session
// ======================
const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGO_DB_URI,
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		},
	})
);


// ======================
// ✅ Passport
// ======================
app.use(passport.initialize());
app.use(passport.session());


// ======================
// ✅ Routes
// ======================
app.use('/users', usersRoute);
app.use('/notes', notesRoute);


// ======================
// ✅ Health check
// ======================
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});


// ======================
// ✅ Server
// ======================
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
	});
}

module.exports = app;