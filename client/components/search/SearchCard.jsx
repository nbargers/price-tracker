import React, { useState } from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
} from '@material-ui/core';
// import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import useStyles from '../../style/theme';
import AddProduct from '../product/AddProduct';

const SearchCard = ({
  productId,
  image,
  link,
  merchant,
  price,
  title,
  // date,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //   const stateObj = {
  //     productName: title,
  //     imageUrl: image,
  //     productUrl: link,
  //     storeName: merchant,
  //     productPrice: price,
  //     productId,
  //     date,
  //   };

  // const handleClick = () => {
  //   addProduct(stateObj);
  //   startSpinner();
  //   clearResults();
  // };

  return (
    //flexDirection: 'column',
    <>
      <Grid container item xs={12} sm={6} md={4} lg={3} direction="column">
        <Card
        // className={classes.productCard}
        // style={{
        //   display: 'flex',
        // }}
        >
          <CardActionArea style={{ height: 300 }}>
            <CardMedia
              className={classes.productCardMedia}
              image={image}
              title={title}
            />
            {/* <Typography variant="caption" display="block">
            {date}
          </Typography> */}
          </CardActionArea>
          <CardContent style={{ flexGrow: 1 }}>
            <Typography variant="h6">{title}</Typography>
            <Typography
              className={classes.productPrice}
              variant="h4"
              color="primary"
            >
              ${price}
            </Typography>
            <Typography variant="subtitle1">
              <a href={link} target="_blank">
                {merchant}
              </a>
            </Typography>
            <Typography variant="overline" display="block">
              Product Id: {productId}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={handleClickOpen}
              variant="contained"
              color="secondary"
              size="small"
              // startIcon={<DeleteIcon />}
              style={{ flexGrow: 1 }}
            >
              Save Product
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <AddProduct
          setOpen={setOpen}
          productUrl={link}
          productId={productId}
          productName={title}
        />
      </Dialog>
    </>
  );

  // return (
  // 	<>
  // 		<img src={image} alt={title} />
  // 		<Typography variant="caption" display="block">
  // 			{date}
  // 		</Typography>
  // 		<Typography variant="h6">{title}</Typography>
  // 		<Typography variant="h4" color="primary">
  // 			${price}
  // 		</Typography>
  // 		<Typography variant="subtitle1">{merchant}</Typography>
  // 		<Typography variant="overline" display="block">
  // 			Id: {productId}
  // 		</Typography>
  // 		<Button
  // 			onClick={handleClick}
  // 			variant="contained"
  // 			color="primary"
  // 			style={{ margin: '0 auto' }}
  // 			startIcon={<AddCircleOutlineIcon />}
  // 		>
  // 			Add Product
  // 		</Button>
  // 	</>
  // );
};

export default SearchCard;
