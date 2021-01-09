const { response } = require("express");
const fetch = require("node-fetch");
const getProductInfo = require("../utils/productWebscraping.js");
const dotenv = require("dotenv").config();

const searchController = {};

searchController.webSearch = (req, res, next) => {

  const {searchValue} = req.params;

  fetch( `https://api.scaleserp.com/search?search_type=shopping&price_low_to_high&num=10&api_key=${process.env.API_URL}&q=${searchValue}`)
  .then((response) => response.json())
  .then((response) =>{
    const goodURL = 'google.com/shopping/product/';

    const items = response.shopping_results
    .filter((item) => {
      return item.link.includes(goodURL);
    })
    .slice(0, 10);

    res.locals.items = items
    next()
  })
  .catch((err) => {
    next({
      log: `searchController.webSearch: ${err}`,
      status: 404,
      message: {
        err: "Web Scraper Fetch Error",
      },
    })
  })
};


module.exports = searchController;
