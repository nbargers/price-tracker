const { Pool } = require("pg");
const dotenv = require("dotenv").config();

//Create connection pool to database:
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    // console.log("executed query", text);
    return pool.query(text, params, callback);
  },
};
