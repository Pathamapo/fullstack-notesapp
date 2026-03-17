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

dotenv.config({ path: './config/.env' });

require('./config/passport');

const app = express();

connectDB();

app.use(express.json());

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:3000',
	credentials: true
}));

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());


const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGO_DB_URI,
});

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'secret123',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 3600 * 24,
			httpOnly: true,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Backend is running 🚀');
});

app.use('/users', usersRoute);
app.use('/notes', notesRoute);

// ✅ Port (แก้ให้ตรง Docker)
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
