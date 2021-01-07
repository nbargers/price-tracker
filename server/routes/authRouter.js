const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authControllers.js");

//Auth Routers:

//SignUp Route:
//POST Request

authRouter.post(
  "/signup",
  authController.createUser,
  authController.verifySession,
  (req, res) => {
    res.status(200).json({ message: "Signed In" });
  }
);

//Login Route:
//POST Request

authRouter.post(
  "/login",
  authController.verifyUser,
  authController.verifySession,
  (req, res) => {
    res.status(200).json({ message: "Signed In" }); //contains {email, userId}
  }
);

module.exports = authRouter;
