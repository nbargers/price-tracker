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

  const hashedPassword = await bcrypt.hash(password, 10);

  let queryString = `
    INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *
    `;
  let values = [email, hashedPassword];

  priceTrackerDB
    .query(queryString, values)
    .then((data) => {
      const id = data.rows[0]._id;
      res.locals.email = data.rows[0].email;
      res.locals.id = id;
      const token = jwt.sign({ user: `${id}` }, "price tracker", {
        expiresIn: "30m",
      });
      res.locals.token = token;
      return next();
    })
    .catch((err) => {
      console.log(err);
      00;
    });
};

authController.retrieveToken = (req, res, next) => {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];

  //Check if bearer is undefined
  if (typeof bearerHeader != "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    //set token variable
    const bearerToken = bearer[1];
    res.locals.token = bearerToken;
    return next();
  } else {
    return next({
      log: "authController.veriftySession: Session token incorrect",
      status: 403,
      message: {
        err: "Session token incorrect. Access forbidden.",
      },
    });
  }
};

authController.verifyToken = (req, res, next) => {
  jwt.verify(res.locals.token, "price tracker", (err, data) => {
    if (err) {
      res.status(403).json({ message: "Session token authorization failed" });
    } else {
      res.locals.userId = data.user
      next()
    }
  });
};

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
              res.locals.email = data.rows[0].email;
              res.locals.id = id;
              const token = jwt.sign({ user: `${id}` }, "price tracker", {
                expiresIn: "30m",
              });
              res.locals.token = token;
              res.cookie("sessionToken", token);
              return next();
            } else {
              return next({
                log: "authController.veriftyUser: User not verified",
                status: 400,
                message: {
                  err: "Invalid credentials",
                },
              });
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
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

authController.logout = (req, res, next) => {
  res.locals.message = "Successfully logged out";
  next();
};

module.exports = authController;
