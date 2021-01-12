const express = require('express');
const productRouter = express.Router();
const jwt = require('jsonwebtoken');
const productController = require('../controllers/ProductControllers');
const authController = require('../controllers/authControllers.js');

//Product Routers:

//Get All Products:
//GET Request
productRouter.get(
  '/',
  authController.retrieveToken,
  authController.verifyToken,
  productController.getProducts,

  (req, res) => {
    res.status(200).json({ products: res.locals.products });
  }
);

//Add One Product:
//POST Request
productRouter.post(
  '/',
  authController.retrieveToken,
  authController.verifyToken,
  productController.addProduct,
  (req, res) => {
    res.status(200).json({ product: res.locals.product });
  }
);

//Delete One Product:
//DELETE Request
productRouter.delete(
  '/:id',
  authController.retrieveToken,
  authController.verifyToken,
  productController.deleteProduct,
  (req, res) => {
    res.status(200).json('Delete product');
  }
);

productRouter.put(
  '/:id',
  authController.retrieveToken,
  authController.verifyToken,
  productController.editProduct,
  (req, res) => {
    res.status(200).json({
      message: 'Product desired price updated',
      product: res.locals.product,
    });
  }
);

module.exports = productRouter;
