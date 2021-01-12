import React, { useState } from 'react';
import SearchCard from './SearchCard';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Button, Divider, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from '../../style/theme';

const SearchList = ({
  searchResults,
  //   addProduct,
  //   clearResults,
  //   startSpinner,
  //   setOpen,
}) => {
  // const date = new Date().toDateString().slice(4, 16);
  const classes = useStyles();

  const resultList = searchResults.map(
    ({ id, title, image, link, merchant, price }) => (
      <>
        <SearchCard
          productId={id}
          // key={uuidv4()}
          image={image}
          link={link}
          merchant={merchant}
          price={price}
          title={title}
          // date={date}
          //   addProduct={addProduct}
          //   clearResults={clearResults}
          //   startSpinner={startSpinner}
        />
        {/* <Divider className={classes.productDivider} /> */}
      </>
    )
  );
  return (
    resultList.length > 0 && (
      <>
        <Grid container item justify="center" xs={12}>
          <Typography variant="h5">Search Results</Typography>
          <Divider variant="middle" />
        </Grid>
        {/* <Grid
          container
          // direction="row"
          // justify="center"
          // alignItems="center"
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          // spacing={3}
        > */}
        {resultList}

        {/* </Grid> */}
      </>
    )
  );
};

export default SearchList;
