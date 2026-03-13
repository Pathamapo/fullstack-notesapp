import { useState, useEffect } from 'react';
import {
	BrowserRouter,
	BrowserRouter as Router,
	Route,
	Switch,
	useHistory,
} from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Create from './components/Create';
import Dashboard from './components/Dashboard';
import FullNote from './components/FullNote';
import Login from './components/Login';
import Register from './components/Register';

import axios from 'axios';

function App() {
	const [username, setUsername] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const history = useHistory();

	useEffect(() => {
		const URL = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/is-logged`;
		const options = {
			withCredentials: true,
			Credential: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		console.log('in APP');
		axios
			.get(URL, options)
			.then((res) => {
				// console.log(res.data.username);
				setUsername(res.data.username);
				setIsLoggedIn(true);
			})
			.catch((error) => {
				console.log(error.response.data);
				if (window.location.href.endsWith('/register')) return;
				else if (!window.location.href.endsWith('/login'))
					window.location.href = '/login';

				setIsLoggedIn(false);
			});
	}, []);
    console.log(process.env.REACT_APP_BACKEND_BASE_URL);
	console.log(username, isLoggedIn);

	return (
		<AuthContext.Provider value={{ username, isLoggedIn, setIsLoggedIn }}>
			<Router>
				<Switch>
					{/* Auth Routes */}
					<Route exact path="/login">
						<Login />
					</Route>
					<Route exact path="/register">
						<Register />
					</Route>

					{/* protected Routes */}
					<Route exact path="/">
						<Dashboard />
					</Route>
					<Route exact path="/create">
						<Create />
					</Route>
					<Route exact path="/:id">
						<FullNote />
					</Route>

					{/* 404 Route */}
					{/* <Route exact path="*"></Route> */}
				</Switch>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
