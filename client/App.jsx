import React, { useEffect, useState } from 'react';
import PrivateRoute from './components/routes/PrivateRoute';
import Login from './components/auth/Login';
import Main from './components/Main';
import NotFound from './components/NotFound';
import { Switch, Route, withRouter } from 'react-router-dom';

const App = (props) => {
  return (
    <div className="app-routes">
      <Switch>
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/home" exact component={Main} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
