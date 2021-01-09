import React, { useState, useEffect, useRef } from 'react';
import NavBar from './nav/NavBar';
import ProductList from './product/ProductList';
import Search from './search/Search';
import Spinner from './search/Spinner';
import ScrollTop from './product/ScrollTop';
import { Grid, Fab } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../components/routes/useAuth';
import SearchList from '../components/search/SearchList';

const Main = () => {
  // const postObj = useRef({});
  const history = useHistory();
  const auth = useAuth();
  const user = auth.getUser();

  const token = user ? user.token : null;

  //state
  const [list, setList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [fetchProduct, setFetch] = useState(false);
  const [productId, setProductId] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const startSpinner = () => {
    console.log('spinner heard');
    setSpinner(true);
  };

  //get all products from search API
  const getSearchedProducts = (products) => {
    setSearchResults(products);
  };

  //add product to userList
  // const addProduct = (stateObj) => {
  //   Object.assign(postObj.current, stateObj);
  //   setFetch(true);
  // };

  // //delete product from userList
  const deleteProduct = (productId) => setProductId(productId);

  //useEffect: userId/CDM
  // useEffect(() => {
  //   if (!userId) return;
  //   getAllProducts();
  // }, [userId]);

  //useEffect: add product
  // useEffect(() => {
  //   if (!fetchProduct) return;

  //   const google_url = postObj.current.productUrl;
  //   const product_name = postObj.current.productName;
  //   const image_url = postObj.current.imageUrl;
  //   const store_name = postObj.current.storeName;
  //   const lowest_daily_price = postObj.current.productPrice;
  //   const product_id = postObj.current.productId;
  //   const date = postObj.current.date;

  //   console.log('track button heard');

  //   //make POST request - Actual request passed to the backend.
  //   fetch(`/api/products/${userId}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       google_url,
  //       userId,
  //       product_name,
  //       image_url,
  //       store_name,
  //       lowest_daily_price,
  //       product_id,
  //       date,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       getAllProducts();
  //       setSpinner(false);
  //     })
  //     .catch((err) => {
  //       console.log('main ue addProduct', err);
  //       setSpinner(false);
  //       alert('Uh oh! Seems like the link is broken. Please try again.');
  //     });

  //   Object.getOwnPropertyNames(postObj.current).forEach(
  //     (property) => delete postObj.current[property]
  //   );
  //   setFetch(false);
  // }, [fetchProduct]);

  //useEffect: delete product
  // useEffect(() => {
  //   if (!productId) return;

  //   const product_id = productId;

  //   fetch(`/api/products/${userId}/${productId}`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ product_id }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(res);
  //       getAllProducts();
  //     })
  //     .catch((err) => console.log('main ue addProduct', err));

  //   setProductId(null);
  // }, [productId]);

  // if (spinner) return <Spinner />;

  // console.log(searchResults);
  return (
    <>
      <NavBar />
      <Grid container style={{ marginTop: 64 }}>
        <Grid
          id="back-to-top-anchor"
          container
          item
          justify="center"
          xs={12}
          style={{ margin: '2rem 0' }}
        >
          <Search getSearchedProducts={getSearchedProducts} />
        </Grid>
        <Grid
          container
          spacing={3}
          direction="row"
          style={{
            padding: '50px',
          }}
        >
          <SearchList searchResults={searchResults} />
          {/* <ProductList list={searchResults} deleteProduct={deleteProduct} /> */}
        </Grid>
      </Grid>
      <ScrollTop>
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default Main;
