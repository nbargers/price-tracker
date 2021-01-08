const express = require("express");
const productRouter = express.Router();
const jwt = require("jsonwebtoken");
const productController = require("../controllers/ProductControllers");
const authController = require("../controllers/authControllers.js");

//Product Routers:

//Get All Products:
//GET Request
productRouter.get(
  "/products/:user",
  productController.getProducts,
  authController.retrieveToken,
  authController.verifyToken,
  (req, res) => {
    res.status(200).json({ products: res.locals.products });
  }
);

//Add One Product:
//POST Request
productRouter.post(
  "/products/:user",
  productController.addProduct,
  authController.retrieveToken,
  authController.verifyToken,
  (req, res) => {
    res.status(200).json({ product: res.locals.product });
  }
);

//Delete One Product:
//DELETE Request
productRouter.delete(
  "/products/:user/:id",
  productController.deleteProduct,
  authController.retrieveToken,
  authController.verifyToken,
  (req, res) => {
    res.status(200).json("Delete product");
  }
);

productRouter.put(
  "/products/:user/:id",
  productController.editProduct,
  authController.retrieveToken,
  authController.verifyToken,
  (req, res) => {
    res
      .status(200)
      .json({
        message: "Product desired price updated",
        product: res.locals.product,
      });
  }
);

module.exports = productRouter;
