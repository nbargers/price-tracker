const { response } = require('express');
const fetch = require('node-fetch');
const getProductInfo = require('../utils/scheduldPriceUpdates.js');
const dotenv = require('dotenv').config();

const searchController = {};

searchController.webSearch = (req, res, next) => {
  const { searchValue } = req.params;

  fetch(
    `https://api.scaleserp.com/search?api_key=${process.env.API_URL}&q=${searchValue}&shopping_buy_on_google=true&google_domain=google.com&location=United+States&gl=us&hl=en&search_type=shopping&sort_by=price_low_to_high&page=1&output=json`
  )
    .then((response) => response.json())
    .then((response) => {
      res.locals.items = response.shopping_results;
      next();
    })
    .catch((err) => {
      next({
        log: `searchController.webSearch: ${err}`,
        status: 404,
        message: {
          err: 'Web Scraper Fetch Error',
        },
      });
    });
};

module.exports = searchController;
