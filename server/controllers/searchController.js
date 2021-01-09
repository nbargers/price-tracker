const { response } = require("express");
const priceTrackerDB = require("../models/priceTrackerModel.js");
const getProductInfo = require("../utils/productWebscraping.js");

const searchController = {};

searchController.webSearch = (req, res, next) => {

  const {searchValue} = req.params;

  fetch( `https://api.scaleserp.com/search?search_type=shopping&price_low_to_high&num=10&api_key=B49C8108639B49E8B42DB696E6591130&q=${searchValue}`)
  .then((response) => response.json())
  .then((response) =>{
    const goodURL = 'google.com/shopping/product/';

    const items = response.shopping_results
    .filter((item) => {
      return item.link.includes(goodUrl);
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
