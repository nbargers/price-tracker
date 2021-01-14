const schedule = require("node-schedule");
const mailer = require("nodemailer");
const dotenv = require("dotenv").config();
const priceTrackerDB = require("../models/priceTrackerModel.js");
const getProductInfo = require("./getProductInfo");

const updatePrices = async () => {
  //query the database to get all the products
  console.log("Updating Prices");
  const retrieveProducts = "SELECT * FROM products";
  const products = await priceTrackerDB.query(retrieveProducts);

  //set result from query to an array
  const productArr = products.rows;

  //iterate over the array to update each products price, price history and send email notifications
  productArr.forEach(async (element) => {
    console.log(element);
    const productId = element._id;
    const userId = element.user_id;
    const date = new Date().toDateString();

    //Use getProductInfo function to build the object of all the data that is needed to be added to the product and lowest_daily_price tables.
    const productInfo = await getProductInfo(element.google_url);
    const {
      lowest_daily_price,
      store_url,
      store_name,
      image_url,
      product_name,
    } = productInfo;

    //Update lowest_daily_price table
    const updateLowestPrice =
      "UPDATE lowest_daily_price SET store_url = $1, store_name = $2, lowest_daily_price =$3 WHERE product_id = $4";
    const productValues = [
      store_url,
      store_name,
      lowest_daily_price,
      productId,
    ];
    const updatedPrices = await priceTrackerDB.query(
      updateLowestPrice,
      productValues
    );
   
    //Update price_history on products table
    const priceArr = element.price_history;
    priceArr.push({ "date": date, "price": lowest_daily_price });
    const updatePriceHistory =
      "UPDATE products SET price_history = $1 WHERE _id = $2";
    const priceValues = [JSON.stringify(priceArr), productId];
    const updateHistory = await priceTrackerDB.query(
      updatePriceHistory,
      priceValues
    );

    //Send email to users
    if (
      Number(element.desired_price) >= Number(lowest_daily_price) &&
      element.email_preference === 'true'
    ) {
      //Grab user data
      console.log('emailing');
      const userQuery = "SELECT * FROM users WHERE _id = $1";
      const userValues = [userId];
      user = await priceTrackerDB.query(userQuery, userValues);
      email = user.rows[0].email;
      console.log(email);

      const transport = mailer.createTransport({
        service: "hotmail",
        auth: { user: "stevehongbusiness@hotmail.com", pass: `${process.env.EMAIL_PASSWORD}`},
