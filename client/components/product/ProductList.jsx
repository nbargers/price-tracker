import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { useAuth } from '../routes/useAuth';
import ProductCard from './ProductCard';
import Response from '../alert/response';

const ProductList = () => {
  const history = useHistory();
  const auth = useAuth();
  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [productList, setProductList] = useState([]);
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    fetch('/api/productsjson', {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        if (res.status === 403) return auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then(({ products }) => {
        setProductList(products);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });
  }, []);

  const updateProductList = (id) => {
    setProductList(productList.filter((product) => id === product.id));
  };

  return (
    <>
      <Response alert={alert} />
      <Grid
        container
        spacing={3}
        direction="row"
        style={{
          padding: '50px',
          marginTop: '50px',
        }}
      >
        <Grid container item justify="flex-start" xs={12}>
          <Typography variant="h5" display="block">
            {productList.length === 0
              ? `You don't have any favorite products.`
              : 'Saved Products'}
          </Typography>
        </Grid>
        {productList.length > 0 &&
          productList.map(
            ({
              _id,
              product_name,
              store_url,
              store_name,
              lowest_daily_price,
              image_url,
            }) => {
              return (
                <>
                  <ProductCard
                    productId={_id}
                    key={uuidv4()}
                    productName={product_name}
                    imageUrl={image_url}
                    storeName={store_name}
                    // updateProductList={updateProductList}
                    setAlert={setAlert}
                    lowestPrice={lowest_daily_price}
                    // deleteProduct={deleteProduct}
                    storeUrl={store_url}
                  />
                </>
              );
            }
          )}
      </Grid>
    </>
  );
};

export default ProductList;
