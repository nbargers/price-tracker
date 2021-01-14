import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const auth = useAuth();

  const user = auth.getUser();

  if (!user) return auth.signout(() => history.push('/'));

  const isLoggedIn = user ? user.isAuthenticated : false;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: '/' }} />
        )
      }
    />
  );
};

export default PrivateRoute;
