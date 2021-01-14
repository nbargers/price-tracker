import React, { useState } from 'react';
import useInput from '../hooks/useInput';
import {
  Button,
  TextField,
  IconButton,
  Checkbox,
  DialogTitle,
  Divider,
  Typography,
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';

import CloseIcon from '@material-ui/icons/Close';
import Response from '../alert/response';
import useStyles from '../../style/theme';
import { useAuth } from '../routes/useAuth';

const AddProduct = ({ setOpen, productId, productUrl, productName }) => {
  const classes = useStyles();

  const auth = useAuth();
  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const token = user.token ? user.token : null;

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [desiredPrice, updateDesiredPrice, resetDesiredPrice] = useInput(0.0);
  const [emailNotification, setEmailNotification] = useState(false);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setEmailNotification(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!desiredPrice) {
      setAlert({
        type: 'error',
        message: 'Price input is required.',
      });
      return;
    }

    // const email = emailNotification === 'no' ? false : true;
    const desired_price = Number(desiredPrice);

    fetch('/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_url: productUrl,
        desired_price,
        email_preference: emailNotification,
      }),
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) auth.signout(() => history.push('/'));

        return res.json().then(({ err }) => {
          throw err;
        });
      })
      .then((res) => {
        console.log('add product ', res);
      })
      .catch((err) => {
        setAlert({
          type: 'error',
          message: err,
        });
      });
  };

  return (
    <div className={classes.registerForm}>
      <Response alert={alert} />
      <IconButton
        aria-label="close"
        onClick={handleClose}
        style={{ alignSelf: 'flex-end' }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ padding: '0' }}>Add Product</DialogTitle>
      <Divider className={classes.registerDivider} variant="middle" />
      <Typography>
        Enter desired price to get email notification and save it to favorites.
      </Typography>
      <form className={classes.loginForm} onSubmit={handleSubmit}>
        <TextField
          className={classes.loginTextField}
          id="email"
          disabled
          label="Product Name"
          variant="filled"
          value={productName}
          //   value={name}
          //   onChange={updateName}
        />
        <TextField
          className={classes.loginTextField}
          id="desiredPrice"
          label="Desired Price"
          variant="filled"
          value={desiredPrice}
          onChange={updateDesiredPrice}
          type="number"
        />
        <FormControlLabel
          style={{ marginLeft: 0, alignItems: 'flex-start' }}
          control={
            <Switch
              checked={emailNotification}
              onChange={handleChange}
              name="emailNotification"
              aria-label="email notification"
            />
          }
          label="Send Email Notifications"
          labelPlacement="top"
        />

        {/* <FormControl component="fieldset">
          <FormLabel component="legend">Email Notifications</FormLabel>
          <RadioGroup
            defaultValue="no"
            aria-label="emailNotification"
            name="customized-radios"
            value={emailNotification}
            onChange={setEmailNotification}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl> */}
        <Button
          className={classes.registerBtn}
          type="submit"
          variant="contained"
          color="primary"
        >
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
