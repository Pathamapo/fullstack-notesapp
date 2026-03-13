const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// User model
const User = require('../models/Users');

const options = {
	usernameField: 'emailId',
};

verifyCallback = async (username, password, done) => {
	try {
		const user = await User.findOne({ emailId: username });

		// User Not Found
		if (!user) return done(null, false);

		// if user found, compare passwords
		const isValidated = await bcrypt.compare(password, user.password);

		// if validated return user else return nothing
		if (isValidated) return done(null, user);
		else return null, false;
	} catch (error) {
		done(error);
	}
};

const localStrategy = new LocalStrategy(options, verifyCallback); // supply options here as first param

passport.use(localStrategy);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
	try {
		const user = await User.findById(userId);
		done(null, user);
	} catch (error) {
		done(error);
	}
});
