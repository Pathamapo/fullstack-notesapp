exports.isAuth = (req, res, next) => {

  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: "Not logged in"
    });
  }

};