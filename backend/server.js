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

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI ไม่ถูกตั้งค่า!');
  process.exit(1);
}

connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use(cors({
  origin: ['http://localhost', 'http://localhost:3000'],
  credentials: true
}));

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI, // ชื่อ env ตรงกับ Docker / K8s
  ttl: 14 * 24 * 60 * 60, // 14 วัน
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 3600 * 24, // 1 วัน
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRoute);
app.use('/notes', notesRoute);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Listening for requests on ${PORT}`);
});

module.exports = app;
