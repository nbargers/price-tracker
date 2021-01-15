const schedule = require("node-schedule");
const mailer = require("nodemailer");
const dotenv = require("dotenv").config();
const priceTrackerDB = require("../models/priceTrackerModel.js");
const getProductInfo = require("./getProductInfo");

//Old function updated one below

// const updatePrices = async () => {
//   //query the database to get all the products
//   console.log("Updating Prices");
//   const retrieveProducts = `SELECT p._id, p.user_id, p.google_url, p.price_history, p.desired_price, p.email_preference, u.email
//                             FROM products AS p
//                             LEFT JOIN users AS u
//                             ON p.user_id=u._id`;
//   const products = await priceTrackerDB.query(retrieveProducts);

//   //set result from query to an array
//   const productArr = products.rows;

//   //iterate over the array to update each products price, price history and send email notifications
//   productArr.forEach(async (element) => {
//     const productId = element._id;
//     const userId = element.user_id;
//     const date = new Date().toDateString();

//     //Use getProductInfo function to build the object of all the data that is needed to be added to the product and lowest_daily_price tables.
//     const productInfo = await getProductInfo(element.google_url);
//     const {
//       lowest_daily_price,
//       store_url,
//       store_name,
//       product_name,
//     } = productInfo;

//     //Update lowest_daily_price table
//     const updateLowestPrice =
//       "UPDATE lowest_daily_price SET store_url = $1, store_name = $2, lowest_daily_price =$3 WHERE product_id = $4";
//     const productValues = [
//       store_url,
//       store_name,
//       Number(lowest_daily_price),
//       productId,
//     ];
//     const updatedPrices = await priceTrackerDB.query(
//       updateLowestPrice,
//       productValues
//     );

//     //Update price_history on products table
//     const priceArr = element.price_history;
//     priceArr.push({ date: date, price: Number(lowest_daily_price) });
//     const updatePriceHistory =
//       "UPDATE products SET price_history = $1 WHERE _id = $2";
//     const priceValues = [JSON.stringify(priceArr), productId];
//     const updateHistory = await priceTrackerDB.query(
//       updatePriceHistory,
//       priceValues
//     );

//     //Send email to users
//     if (
//       Number(element.desired_price) >= Number(lowest_daily_price) &&
//       element.email_preference === "true"
//     ) {
//       //Grab user data
//       console.log("emailing");
//       const userQuery = "SELECT * FROM users WHERE _id = $1";
//       const userValues = [userId];
//       user = await priceTrackerDB.query(userQuery, userValues);
//       email = user.rows[0].email;
//       console.log(email);

//       const transport = mailer.createTransport({
//         service: "hotmail",
//         auth: {
//           user: "stevehongbusiness@hotmail.com",
//           pass: `${process.env.EMAIL_PASSWORD}`,
//         },
//       });

//       const message = {
//         from: "stevehongbusiness@hotmail.com",
//         to: `${email}`,
//         subject: "Desired Price Match",
//         text: `The ${product_name} is currently on sale for ${lowest_daily_price} at ${store_name}. Follow this link, ${element.google_url}, to buy your item while the price lasts!`,
//       };

//       await transport.sendMail(message, (err, info) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("sent " + info.response);
//         }
//       });
//     }
//   });
// };


const updatePrices = async () => {
  //Set Date Variable
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  let newDate = year + "-" + month + "-" + day;

  //Query Strings
  //Retrieve Products and User Email
  const retrieveProducts = `SELECT p._id, p.user_id, p.google_url, p.price_history, p.desired_price, p.email_preference, u.email
                            FROM products AS p
                            LEFT JOIN users AS u
                            ON p.user_id=u._id`;

  //Update lowest_daily_price table
  const updateLowestPrice ="UPDATE lowest_daily_price SET store_url = $1, store_name = $2, lowest_daily_price =$3 WHERE product_id = $4";

  //Update Product Price History
  const updatePriceHistory = "UPDATE products SET price_history = $1 WHERE _id = $2";

  try {
    //Retrieve all products
    const products = await priceTrackerDB.query(retrieveProducts);

    //Set result from query to an array
    const productArr = products.rows;

    //Iterate over the products array
    productArr.forEach(async (product) => {
      //Deconstruct key value pairs
      const {_id, google_url, email, desired_price, price_history, email_preference} = product

      //Get updated info with puppeteer function
      const productInfo = await getProductInfo(google_url);
      const {lowest_daily_price, store_url, store_name, product_name} = productInfo;
  
      //Update lowest_daily_price table
      const productValues = [store_url, store_name, Number(lowest_daily_price), _id];
      const updatedPrices = await priceTrackerDB.query(updateLowestPrice, productValues);
  
      //Update price_history on products table
      price_history.push({ date: newDate, price: Number(lowest_daily_price) });
      const priceValues = [JSON.stringify(price_history), _id];
      const updateHistory = await priceTrackerDB.query(updatePriceHistory, priceValues);
  
      //Send email to users
      if (Number(desired_price) >= Number(lowest_daily_price) && email_preference === "true") {
        const transport = mailer.createTransport({
          service: "hotmail",
          auth: {
            user: "stevehongbusiness@hotmail.com",
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });
  
        const message = {
          from: "stevehongbusiness@hotmail.com",
          to: `${email}`,
          subject: "Desired Price Match",
          text: `The ${product_name} is currently on sale for ${lowest_daily_price} at ${store_name}. Follow this link, ${google_url}, to buy your item while the price lasts!`,
        };
  
        await transport.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sent " + info.response);
          }
        });
      }
    })
  } catch (error) {
    console.log(`schedulePriceUpdate error ocurred: ${error}`)
  }
}

const midnightUpdate = schedule.scheduleJob("0 0 * * *", function () {
  updatePrices();
});

const noonUpdate = schedule.scheduleJob("0 12 * * *", function () {
  updatePrices();
});

module.exports = updatePrices;
