import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Register = () => {
	// State Variables
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [hint, setHint] = useState('');

	// Initialize history
	const history = useHistory();

	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	// TODO: CHECK IF USER IS LOGGED IN ALREADY
	useEffect(() => {
		if (isLoggedIn) history.push('/');
	}, [isLoggedIn]);

	// Functions
	const handleSubmit = () => {
		// console.log(username, email, password);

		const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/register`;
		const body = { username, emailId: email, password };
		const headers = { 'Content-Type': 'application/json' };
		// console.log(body);

		// POST user data to /user/register on backend
		axios
			.post(url, body, { headers })
			.then((res) => {
				if (res.data.success) {
					setHint(res.data.message);
					history.push('/login');
				}
			})
			.catch((err) => {
				// console.log(err.response.data);
				if (!err.response.data.success)
					setHint('User validation failed. Input valid credentials');
			});
	};

	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish sm:flex justify-center items-center">
			<div className="p-4 flex flex-col justify-around h-full sm:w-10/12 md:w-7/12 lg:w-5/12 ">
				<div>
					<h1 className="text-4xl font-bold ">
						It's our pleasure to have you here.
					</h1>
					<p className="capitalize text-2xl mt-3 text-gray-300">
						Let's register you!
					</p>
				</div>
				<div>
					<div className="">
						<p className="w-11/12 text-center mt-3 text-lg text-font-secondary rounded">
							{hint}
						</p>
						<input
							type="text"
							className="outline-none w-full p-4 my-3 rounded-lg border border-gray-700 bg-bg-black text-lg"
							placeholder="Username"
							autoComplete="off"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<input
							type="email"
							className="outline-none w-full p-4 my-3 rounded-lg border border-gray-700 bg-bg-black text-lg"
							placeholder="Email"
							autoComplete="off"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							className="outline-none w-full p-4 my-3 rounded-lg border border-gray-700 bg-bg-black text-lg"
							placeholder="Password"
							autoComplete="off"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>
				<div>
					<button
						className="w-full p-4 my-3 rounded-lg text-black font-bold text-xl bg-font-main"
						onClick={handleSubmit}
					>
						SUBMIT
					</button>
					<p className="text-center text-gray-400">
						Have an account already?&nbsp;
						<Link to="/login" className="underline">
							Login to your account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
