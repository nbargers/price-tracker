const priceTrackerDB = require("../models/priceTrackerModel.js");
const getProductInfo = require("../utils/getProductInfo.js");

const productController = {};

//Get Products Controller- GET Request:
productController.getProducts = (req, res, next) => {
  // This gets the user's products with the most recent timestamp:

  //NEW QUERY
  const userProducts = `SELECT * FROM products 
  JOIN lowest_daily_price ON (products._id=lowest_daily_price.product_id) 
  WHERE user_id=$1
  ORDER BY lowest_daily_price.product_id, lowest_daily_price.timestamp DESC
  `;

  let user = [req.params.user];

  priceTrackerDB
    .query(userProducts, user)
    .then((data) => {
      res.locals.products = data.rows;
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(
        res.status(400).send("ERROR in getProducts controller: " + err)
      );
    });
};


//Add Product Controller- POST Request:
productController.addProduct = async (req, res, next) => {
  // front end sends user_id and google_url only.  Then we use puppeteer to scrape the following:
  const { google_url, desired_price, email_preference } = req.body; //from websraping and frontend
  console.log(google_url)
  const { userId } = res.locals;
  let productInfo = {};

  //Web scrape the google_url:
  try {
    productInfo = await getProductInfo(google_url); //Returns an object: {lowest_daily_price, product_name, store_url, store_name, image_url}
    productInfo.price_history = [{date: new Date().toDateString(), price: productInfo.lowest_daily_price }]
  } catch (err) {
    return next(
      res.status(400).send("ERROR in getProductsInfo function: " + err)
    );
  }

  //Add google_url to object:
  productInfo.google_url = google_url;
    //Need to add lowest daily price to price_history

    //Add to products table and return product_id. Then add product_id to object
    const newProduct = await priceTrackerDB.query(
      `INSERT INTO products (product_name, image_url, google_url, user_id, desired_price, price_history, email_preference) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *`,
      [productInfo.product_name, productInfo.image_url, productInfo.google_url, userId, desired_price, productInfo.price_history, email_preference]
    );
    // productId = newProductId.rows[0]._id;
    res.locals.product = newProduct.rows[0]
  // }

  //Add to lowest_daily_price table using product_id:
  const lowestDailyPriceQuery = `INSERT into lowest_daily_price (product_id, store_name, lowest_daily_price,	store_url) VALUES ($1,$2,$3,$4)`;

  const lowestDailyPriceValues = [
    newProduct.rows[0]._id,
    productInfo.store_name,
    productInfo.lowest_daily_price,
    productInfo.store_url,
  ];
  try {
    const lowestDailyPriceInsert = await priceTrackerDB.query(
      lowestDailyPriceQuery,
      lowestDailyPriceValues
    );
  
    return next();
  } catch (err) {
    console.log("error: ", error);
    return next(
      res.status(400).send("ERROR in addProducts controller: " + err)
    );
  }
};

//Delete Product Controller- DELETE Request:
productController.deleteProduct = (req, res, next) => {
  const { id } = req.params;

  const deleteProduct = `DELETE FROM products WHERE _id=$1`;

  priceTrackerDB
    .query(deleteProduct, [id])
    .then((data) => {

      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(
        res.status(400).send("ERROR in deleteProducts controller: " + err)
      );
    });
};


//Edit product desired price
productController.editProduct = async (req, res, next) => {
  const { id } = req.params;
  const {desiredPrice} = req.body;

  try {
    const editProduct = 'UPDATE products SET desired_price = $1 WHERE _id = $2'
    const product = await priceTrackerDB.query(editProduct, [desiredPrice, id])
    res.locals.product = product.rows[0];
    next()
  } catch (error) {
    next({
      log: "productController.editProduct: Internal server error",
      status: 500,
      message: {
        err: "Internal Server Error",
      },
    })
  }
};

module.exports = productController;
