import React, { useState, useEffect } from 'react';
import NavBar from '../nav/NavBar';
import { useAuth } from '../routes/useAuth';
import { useParams } from 'react-router-dom';
import DailyPriceChart from './DailyPriceChart';
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@material-ui/core';
import useStyles from '../../style/theme';

const Favorite = () => {
  const classes = useStyles();
  const auth = useAuth();
  const user = auth.getUser();
  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [favorite, setFavorite] = useState({});
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  let { productId } = useParams();

  productId = Number(productId);

  useEffect(() => {
    fetch('/api/product', {
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
      .then(({ product }) => {
        setFavorite(product);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });
  }, []);

  if (!favorite.price_history) {
    return <></>;
  }

  return (
    <>
      <NavBar />
      <Grid
        container
        spacing={3}
        direction="column"
        style={{
          padding: '50px',
          marginTop: '50px',
        }}
      >
        <Card
          className={classes.productCard}
          // style={{
          //   display: 'flex',
          // }}
        >
          <CardContent
            style={{
              display: 'flex',
            }}
          >
            <Typography variant="h2">{favorite.product_name}</Typography>
          </CardContent>
          <CardActionArea style={{ height: 300, flexGrow: 1 }}>
            <CardMedia
              className={classes.productCardMedia}
              image={favorite.image_url}
              title={favorite.product_name}
            />
          </CardActionArea>
          <CardContent>
            <Typography
              className={classes.lowestPrice}
              // variant="h4"
              color="primary"
            >
              Lowest Product Price: ${favorite.lowest_daily_price}
            </Typography>
            <Typography variant="subtitle1">
              <a href={favorite.storeName} target="_blank">
                {favorite.storeName}
              </a>
            </Typography>
          </CardContent>
        </Card>
        <Grid
          container
          spacing={3}
          direction="column"
          style={{
            paddingTop: '50px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <Card>
            <Typography variant="h2">Lowest Daily Prices</Typography>
            <DailyPriceChart priceHistory={favorite.price_history} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Favorite;
