const priceTrackerDB = require("../models/priceTrackerModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {};

//Signup Controller- POST Request:
authController.createUser = async (req, res, next) => {
  const { email, password } = req.body;
  const checkDuplicateUser = `SELECT * FROM users WHERE email=$1`;
  const checkUser = await priceTrackerDB.query(checkDuplicateUser, [email]);

  if (checkUser.rowCount) {
    return next({
      log: "authController.createUser: User already exists",
      status: 409,
      message: {
        err: "User already exists",
      },
    });
  }

  // if (email.length > 0 && password.length > 0) {
  const hashedPassword = await bcrypt.hash(password, 10);

  let queryString = `
    INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *
    `;
  let values = [email, hashedPassword];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      const id = data.rows[0]._id;
      res.locals.id = id;
      const token = jwt.sign({ user: `${id}` }, "price tracker", {expiresIn : "30m"});
      res.locals.token = token;
      // res.locals.loginInfo = {};
      // res.locals.loginInfo.userId = data.rows[0]._id;
      // res.locals.loginInfo.email = req.body.email;
      return next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};


authController.verifySession = (req, res, next) => {
  //Get auth header value
  const bearerHeader = req.headers['authorization'];

  //Check if bearer is undefined
  if(typeof bearerHeader != 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(' ');
    //set token variable
    const bearerToken = bearer[1];
    req.token = bearerToken;
   return next();
  } else {
    return next({
      log: "authController.veriftySession: Session token incorrect",
      status: 403,
      message: {
        err: "Session token incorrect. Access forbidden.",
      },
    })
  }
};

//SSIDCookie Controller:
// authController.setSSIDCookie = (req, res, next) => {
//   //First, set cookie on the client to a random number:
//   let randomNumber = Math.floor(Math.random() * 1000000);
//   let options = { maxAge: 90000000, httpOnly: true };

//   res.cookie("ssid", randomNumber, options);

//   //second, save the ssid into the database.
//   let queryString = `
//   INSERT INTO sessions ( user_id, ssid) VALUES ($1, $2) RETURNING *
//   `;
//   let values = [res.locals.loginInfo.userId, randomNumber];

//   priceTrackerDB
//     .query(queryString, values)
//     .then((data) => {
//       return next();
//     })
//     .catch((err) => {
//       console.log(err);
//       return next(err);
//     });

//   return next();
// };

//Login Controller - POST Request:
authController.verifyUser = (req, res, next) => {
  let queryString = `
    SELECT * FROM users WHERE email=$1
    `;
  let values = [req.body.email];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      if (data.rows.length > 0) {
        bcrypt
          .compare(req.body.password, data.rows[0].password)
          .then((isMatch) => {
            if (isMatch) {
              const id = data.rows[0]._id;
              res.locals.id = id;
              const token = jwt.sign({ user: `${id}` }, "price tracker", {expiresIn : "30m"});
              res.locals.token = token;
              res.cookie('sessionToken', token) 
              // res.locals.loginInfo = {};
              // res.locals.loginInfo.userId = data.rows[0]._id;
              // res.locals.loginInfo.email = req.body.email;
              return next();
            } else {
              return next({
                log: "authController.veriftyUser: User not verified",
                status: 400,
                message: {
                  err: "Invalid credentials",
                },
              })
            }
          });
      } else {
        console.log("invalid email or password");
        return next({
          log: "authController.veriftyUser: User not verified",
          status: 406,
          message: {
            err: "Invalid Credentials.",
          },
        })
      }
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

authController.logout = (req, res, next) => {
//clear session
sessionStorage.clear()
res.locals.message = 'Successfully logged out';
next()
}
module.exports = authController;
