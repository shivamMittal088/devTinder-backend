const jwt = require("jsonwebtoken");
const UserModel = require("./../models/UserModel");
const cookieParser = require("cookie-parser");
const express = require('express');


const app = express();

app.use(cookieParser());

const auth = async (req, res, next) => {
  try {
    const { auth_token } = req.cookies;
    if (!auth_token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = await jwt.verify(auth_token, "DEV@TINDER$123");
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("Auth Error:", err); // 👈 Log real error
    return res.status(401).send(`Unauthorized: ${err.message}`);
  }
};

module.exports = { auth };