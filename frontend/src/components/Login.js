import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Login = () => {
	// State Variables
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(true);
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
		// console.log(email, password);

		const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`;
		const body = { emailId: email, password };
		const options = {
			withCredentials: true,
			Credential: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		// POST user data to /user/register on backend
		axios
			.post(url, body, options)
			.then((res) => {
				setIsLoading(true);

				if (res.data.success) {
					console.log(res.data);
					setHint(res.data.message);
					setIsLoggedIn(true);
					history.push('/');
				}
			})
			.then(() => {
				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
				setIsLoggedIn(false);
				// console.log(err.response.data);
				if (!err.response.data.success)
					setHint('Please input valid credentials');
			});
	};
	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish sm:flex justify-center items-center">
			<div className="p-4 flex flex-col justify-around h-full sm:w-10/12 md:w-7/12 lg:w-5/12 ">
				<div>
					<h1 className="text-4xl font-bold ">Let's sign you in.</h1>
					<p className="capitalize text-2xl mt-3 text-gray-300">
						Welcome back. We missed you.
					</p>
				</div>
				<div>
					<div className="">
						<p className="w-11/12 text-center mt-3 text-lg text-font-secondary rounded">
							{hint}
						</p>
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
						type="submit"
						className="w-full p-4 my-3 rounded-lg text-black font-bold text-xl bg-font-main"
						onClick={handleSubmit}
					>
						SUBMIT
					</button>
					<p className="text-center text-gray-400">
						Don't have an account?&nbsp;
						<Link to="/register" className="underline">
							Register a new user
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
