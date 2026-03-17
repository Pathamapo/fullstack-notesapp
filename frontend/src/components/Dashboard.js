import Note from './Note';
import { TiDocumentAdd } from 'react-icons/ti';
import { CgLogOut } from 'react-icons/cg';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
	// State
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const history = useHistory();

	const { username, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

	const noteColors = [
		'bg-red-100',
		'bg-blue-100',
		'bg-yellow-100',
		'bg-green-100',
		'bg-purple-100',
		'bg-rose-100',
		'bg-orange-100',
	];

	const noteColorsCopy = useRef([...noteColors]);

	useEffect(() => {
		if (isLoggedIn) getNotes();
	}, [isLoggedIn]);

	// Fetch Notes
	const getNotes = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes`;

			const res = await axios.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			setData(res.data.notes || []);
		} catch (error) {
			if (error?.response?.data?.message) {
				console.error(error.response.data.message);
			}
			setData([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Logout
	const handleLogout = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/users/logout`;

			await axios.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			setIsLoggedIn(false);
			history.push('/login');
		} catch (error) {
			console.error(error);
		}
	};

	// Random Color
	const getRandomColor = () => {
		if (noteColorsCopy.current.length === 0) {
			noteColorsCopy.current = [...noteColors];
		}

		const randomIndex = Math.floor(
			Math.random() * noteColorsCopy.current.length
		);

		const color = noteColorsCopy.current[randomIndex];
		noteColorsCopy.current.splice(randomIndex, 1);

		return color;
	};

	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish">
			<div className="flex flex-col h-full">

				{/* Header */}
				<div className="p-4 flex justify-between items-center text-gray-300">
					<h2 className="text-3xl capitalize">
						{username + "'s"} Notes
					</h2>

					<div className="flex items-center gap-3">

						<button
							className="rounded-full transition duration-150 text-3xl p-2 flex items-center cursor-pointer hover:-translate-y-1"
							title="Log out"
							onClick={handleLogout}
						>
							<CgLogOut />
							<span className="hidden md:block ml-1 text-xl">
								Logout
							</span>
						</button>

						<button
							className="rounded-full transition duration-150 text-3xl p-2 flex items-center cursor-pointer hover:-translate-y-1"
							title="Add New Note"
							onClick={() => history.push('/create')}
						>
							<TiDocumentAdd />
							<span className="hidden md:block ml-1 text-xl">
								Add Note
							</span>
						</button>
					</div>
				</div>

				{/* Notes */}
				{isLoading ? (
					<h1 className="p-4">LOADING...</h1>
				) : (
					<div className="flex-1 overflow-y-auto">
						<div className="p-4 flex flex-wrap gap-4 justify-center sm:justify-start">
							{data.map((note) => {
								const bgColor = getRandomColor();

								return (
									<Note
										bgColor={bgColor}
										note={note}
										key={note._id}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
