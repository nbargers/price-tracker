import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ProvideAuth } from './components/routes/useAuth'

ReactDOM.render(
	<React.StrictMode>
		<CssBaseline />
		<BrowserRouter>
		<ProvideAuth>
			<App />
		</ProvideAuth>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
