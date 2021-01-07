import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useAuth();

  const user = auth.getUser();
  const isLoggedIn = user ? user.isAuthenticated : false;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/' }} />
        )
      }
    />
  );
};

export default PrivateRoute;
