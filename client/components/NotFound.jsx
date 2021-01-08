import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@material-ui/core';
import useStyles from '../style/theme';

const NotFound = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container justify="center" direction="column" alignItems="center">
        <Typography
          variant="h2"
          color="primary"
          style={{ fontWeight: '600', marginBottom: '20px' }}
        >
          404 PAGE NOT FOUND
        </Typography>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Return to Home
          </Button>
        </Link>
      </Grid>
    </div>
  );
};

export default NotFound;
