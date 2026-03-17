const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Security middlewares
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Routes
const usersRoute = require('./routes/users');
const notesRoute = require('./routes/notes');

// DB
const connectDB = require('./config/connectDB');

// ENV
dotenv.config({ path: './config/.env' });

// Passport config
require('./config/passport');

// Initialize app
const app = express();

// ✅ Connect database
connectDB();

// Body parser
app.use(express.json());

// ✅ CORS (แก้ให้ flexible สำหรับ Docker / deploy)
app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:3000',
	credentials: true
}));

// Security
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

// ✅ Session store (แก้ให้ไม่พังเวลา env ไม่มี)
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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Health check (สำคัญมากสำหรับ Docker / K8s)
app.get('/', (req, res) => {
	res.send('Backend is running 🚀');
});

// Routes
app.use('/users', usersRoute);
app.use('/notes', notesRoute);

// ✅ Port (แก้ให้ตรง Docker)
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
