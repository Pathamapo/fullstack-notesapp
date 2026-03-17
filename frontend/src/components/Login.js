import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Login = () => {
	// State
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [hint, setHint] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const history = useHistory();
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	// Redirect if already logged in
	useEffect(() => {
		if (isLoggedIn) history.push('/');
	}, [isLoggedIn, history]);

	// Submit
	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			setHint('');

			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`;

			const res = await axios.post(
				url,
				{ emailId: email, password },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (res.data.success) {
				setHint(res.data.message);
				setIsLoggedIn(true);
				history.push('/');
			}
		} catch (err) {
			setIsLoggedIn(false);

			if (err?.response?.data?.message) {
				setHint(err.response.data.message);
			} else {
				setHint('Login failed');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish sm:flex justify-center items-center">
			<div className="p-4 flex flex-col justify-around h-full sm:w-10/12 md:w-7/12 lg:w-5/12">

				{/* Header */}
				<div>
					<h1 className="text-4xl font-bold">Let's sign you in.</h1>
					<p className="capitalize text-2xl mt-3 text-gray-300">
						Welcome back. We missed you.
					</p>
				</div>

				{/* Form */}
				<div>
					<p className="w-11/12 text-center mt-3 text-lg text-font-secondary">
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

				{/* Actions */}
				<div>
					<button
						type="button"
						className="w-full p-4 my-3 rounded-lg text-black font-bold text-xl bg-font-main disabled:opacity-50"
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? 'Loading...' : 'SUBMIT'}
					</button>

					<p className="text-center text-gray-400">
						Don't have an account?{' '}
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
