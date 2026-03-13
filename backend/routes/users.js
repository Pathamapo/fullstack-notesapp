const express = require('express');
const passport = require('passport');
const router = express.Router();
const { isAuth } = require('../middlewares/isAuth');
const {
	registerUser,
	loginUser,
	logoutUser,
	isLoggedIn,
} = require('../controllers/users');

router.post('/register', registerUser);
router.post('/login', passport.authenticate('local'), loginUser);
router.get('/logout', logoutUser);
router.get('/is-logged', isAuth, isLoggedIn);

module.exports = router;