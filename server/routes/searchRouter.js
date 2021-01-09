const express = require("express");
const searchRouter = express.Router();

const searchController = require("../controllers/searchController.js");
const authController = require("../controllers/authControllers.js");

searchRouter.get("/",  authController.retrieveToken, authController.verifyToken, searchController.webSearch, (req, res) => {
  res.status(200).json({ message: "Items Retrieved", items: res.locals.items });
  }
);

module.exports = searchRouter;
