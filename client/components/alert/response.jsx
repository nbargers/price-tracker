import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    top: 0,
  },
}));

const Response = ({ alert }) => {
  const { type, message, hide } = alert;
  const classes = useStyles();

  return (
    <div className={classes.root} display={hide ? 'none' : 'block'}>
      {type && (
        <Alert severity={type} elevation={6} variant="filled">
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default Response;
