import { useState, useEffect, useMemo } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
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

	useEffect(() => {
		const URL = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/is-logged`;

		const options = {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		axios
			.get(URL, options)
			.then((res) => {
				setUsername(res.data.username);
				setIsLoggedIn(true);
			})
			.catch((error) => {
				if (window.location.href.endsWith('/register')) return;
				if (!window.location.href.endsWith('/login')) {
					window.location.href = '/login';
				}
				setIsLoggedIn(false);
			});
	}, []);

	// ✅ แก้ SonarQube: ใช้ useMemo
	const authValue = useMemo(() => {
		return { username, isLoggedIn, setIsLoggedIn };
	}, [username, isLoggedIn]);

	return (
		<AuthContext.Provider value={authValue}>
			<Router>
				<Switch>
					<Route exact path="/login">
						<Login />
					</Route>

					<Route exact path="/register">
						<Register />
					</Route>

					<Route exact path="/">
						<Dashboard />
					</Route>

					<Route exact path="/create">
						<Create />
					</Route>

					<Route exact path="/:id">
						<FullNote />
					</Route>
				</Switch>
			</Router>
		</AuthContext.Provider>
	);
}

export default App;
