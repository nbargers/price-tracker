import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Grid, Typography } from '@material-ui/core';
import { useAuth } from '../routes/useAuth';
import ProductCard from './ProductCard';
import Response from '../alert/response';

const ProductList = () => {
  const auth = useAuth();
  const user = auth.getUser();
  const token = user.token ? user.token : null;

  const [productList, setProductList] = useState([]);
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  useEffect(() => {
    fetch('/api/search-results', {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then((data) => {
        setProductList(data.items);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });

    return () => {};
  }, []);

  const updateProductList = (id) => {
    setProductList(productList.filter((product) => id === product.id));
  };

  // const productItems = list.map(
  //   ({
  //     product_name,
  //     image_url,
  //     store_name,
  //     lowest_daily_price,
  //     store_url,
  //     product_id,
  //     date,
  //   }) => {
  //     //wrap in Link for detail route, if so
  //     return (
  //       <ProductCard
  //         productId={product_id}
  //         key={uuidv4()}
  //         productName={product_name}
  //         imageUrl={image_url}
  //         storeName={store_name}
  //         productPrice={lowest_daily_price}
  //         deleteProduct={deleteProduct}
  //         storeUrl={store_url}
  //         date={date}
  //       />
  //     );
  //   }
  // );

  // return <>{productItems}</>;
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
              ? `You don't have any favourite products.`
              : 'Saved Products'}
          </Typography>
        </Grid>
        {productList.length > 0 &&
          productList.map(({ id, title, link, merchant }) => {
            return (
              <>
                <ProductCard
                  productId={id}
                  key={uuidv4()}
                  productName={title}
                  // imageUrl={link}
                  storeName={merchant}
                  updateProductList={updateProductList}
                  setAlert={setAlert}
                  // productPrice={lowest_daily_price}
                  // deleteProduct={deleteProduct}
                  // storeUrl={store_url}
                />
              </>
            );
          })}
      </Grid>
    </>
  );
};

export default ProductList;
