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
dotenv.config();

// Passport config
require('./config/passport');

// Initialize app
const app = express();


// ======================
// ✅ Connect database
// ======================
connectDB();


// ======================
// ✅ Body parser
// ======================
app.use(express.json());


// ======================
// ✅ CORS (รองรับ K8s + ENV)
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
// ✅ Session (แก้ ENV + secure)
// ======================
if (!process.env.MONGO_URI) {
	console.error('❌ MONGO_URI is missing in .env');
	process.exit(1);
}

const sessionStore = MongoStore.create({
	mongoUrl: process.env.MONGO_URI,
});

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false, // 🔥 สำคัญ (ลด session ขยะ)
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // 1 day
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production', // 🔥 ใช้ https เท่านั้นใน prod
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
// ✅ Health check (สำคัญสำหรับ K8s)
// ======================
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});


// ======================
// ✅ Server (แยกตอน test)
// ======================
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
	});
}

module.exports = app;