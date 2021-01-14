const PORT = process.env.PORT || 3000;
const express = require('express');
const path = require('path');
const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const searchRouter = require('./routes/searchRouter');
const updatePrices = require('./utils/scheduldPriceUpdates');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

//Added for Heroku deployment:
app.use('/build', express.static(path.join(__dirname, '../build')));

//Route Handlers:
//localhost:8080/api/auth/signup
app.use('/api/auth', authRouter);

//localhost:8080/api/products/getproducts
app.use('/api/products', productRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

/**
 * Temp file
 * for searching API
 */
app.get('/api/search-results', (req, res) => {
  res.sendFile(path.join(__dirname, 'new-results.json'));
});

////localhost:8080/api/search/
app.use('/api/search', searchRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

//Global Error handler
app.use((err, req, res, next) => {
  // console.log('Global Error', err);
  const defaultError = {
    log: 'Express error handler caught: unknown middleware error',
    status: 400,
    message: {
      err: 'Unexpected error occured',
    },
  };

  const errObj = Object.assign(defaultError, err);
  console.log('SEREVER ERROR:', errObj.log);
  return res.status(errObj.status).json(errObj.message);
});

//Node schedule to run the funciton every 12 hours

app.listen(PORT, () => console.log('Server Running On Port ' + PORT));
