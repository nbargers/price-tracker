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
  const productArr = products.rows[0];

  //iterate over the array to update each products price, price history and send email notifications
  productArr.forEach(async (element) => {
    const productId = element._id;
    const userId = element.user_id;
    const date = new Date().toDateString();

    //Use getProductInfo function to build the object of all the data that is needed to be added to the product and lowest_daily_price tables.
    const productInfo = getProductInfo(element.googleUrl);
    const {
      lowest_daily_price,
      store_url,
      store_name,
      image_url,
      product_name,
    } = productInfo;

    //Update lowest_daily_price table
    const updateLowestPrice =
      "UPDATE lowest_daily_price SET store_url = $1, store_name = $2, image_url = $3, lowest_daily_price =$4 WHERE product_id = $5";
    const productValues = [
      store_url,
      store_name,
      image_url,
      lowest_daily_price,
      productId,
    ];
    const updatedPrices = await priceTrackerDB.query(
      updateLowestPrice,
      productValues
    );

    //Update price_history on products table
    const priceArr = element.price_history;
    priceArr.push({ date: date, price: lowest_daily_price });
    const updatePriceHistory =
      "UPDATE products SET price_history = $1 WHERE _id = $2 RETURNING *";
    const priceValues = [priceArr, productId];
    const updateHistory = await priceTrackerDB.query(
      updatePriceHistory,
      priceValues
    );

    //Send email to users
    if (
      element.desired_price <= productInfo.lowest_daily_price &&
      element.email_preference === true
    ) {
      //Grab user data
      const userQuery = "SELECT * FROM users WHERE _id = $1";
      const userValues = [userId];
      user = await priceTrackerDB.query(userQuery, userValues);
      email = user.rows[0].email;
      emailPreference = user.rows[0].email_preference;

      const transport = mailer.createTransport({
        service: "hotmail",
        auth: { user: "stevehongbusiness@hotmail.com", pass: `${process.env.EMAIL_PASSWORD}`},
      });

      const message = {
        from: "stevehongbusiness@hotmail.com",
        to: `${email}`,
        subject: "Desired Price Match",
        text: `The ${product_name} is currently on sale for ${lowest_daily_price} at ${store_name}. Follow this link, ${store_url}, to buy your item while the price lasts!`,
      };

      transport.sendMail(message, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("sent " + info.response);
        }
      });
    }
  });
};

const midnightUpdate = schedule.scheduleJob("0 0 * * *", function () {
  updatePrices();
});

const noonUpdate = schedule.scheduleJob("0 12 * * *", function () {
  updatePrices();
});

module.exports = updatePrices;
