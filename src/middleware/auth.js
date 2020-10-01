const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var User = mongoose.model("User");

//const User =  require('../models/User');
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // we know we created jwt with user id,,so we can decode the same with our token..and get back userid back
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // we also need to chk that tokens array
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    //we can provide the user from here...so routehandler dont need to fetch user again
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Please authethicate");
  }
};

module.exports = auth;
