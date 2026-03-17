const User = require('../models/Users');
const { hash } = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    let user = new User({
      username,
      email,
      password
    });

    // Hash password
    user.password = await hash(user.password, 10);

    user = await user.save();

    res.status(200).json({
      success: true,
      message: 'User Registered',
      user,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};

exports.loginUser = async (req, res) => {

  res.status(200).json({
    success: true,
    message: 'User Logged In',
    user: req.user,
  });

};

exports.logoutUser = async (req, res, next) => {

  req.logout(function(err){
    if(err){ return next(err); }
  });

  res.status(200).json({
    success: true,
    message: 'User Logged Out',
  });

};


exports.isLoggedIn = async (req, res) => {

  if (req.user) {
    res.status(200).json({
      success: true,
      username: req.user.username,
      message: 'Login is active.',
    });
  } else {
    res.status(200).json({
      success: false,
      message: 'User not logged in',
    });
  }

};
