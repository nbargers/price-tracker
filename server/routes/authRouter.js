const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authControllers.js");

//Auth Routers:

//SignUp Route:
//POST Request

authRouter.post("/signup", authController.createUser, authController.verifyToken, (req, res) => {
  res.status(200).json({ message: "Signed In", token: res.locals.token, email: res.locals.email, id : res.locals.id });
});

//Login Route:
//POST Request

authRouter.post("/login", authController.verifyUser, authController.verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "Signed In", token: res.locals.token, email: res.locals.email, id : res.locals.id  });
});

authRouter.get("/logout", authController.logout, (req, res) => {
  res.status(200).json({ message: res.locals.message });
});

module.exports = authRouter;
