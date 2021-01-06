import React from 'react';
// import Login from '../auth/Login';
import { Route } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({
	component: Component,
	...rest
}) => {
	let auth = useAuth();
	console.log(auth.user);
	return (
		<Route
			{...rest}
			render={() => {
				return auth.user.isAuthenticated ? (
					<Component {...rest} />
				) : (
					<Login /> 
					// registerUser={registerUser} loginUser={loginUser} />
				);
			}}
		/>
	);
};

export default PrivateRoute;
