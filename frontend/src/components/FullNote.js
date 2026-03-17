import { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const FullNote = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isContentEdited, setIsContentEdited] = useState(false);
	const [createdAt, setCreatedAt] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const history = useHistory();
	const { id } = useParams();
	const { isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (isLoggedIn) getNote();
	}, [isLoggedIn]);

	const getNote = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;

			const res = await axios.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			setTitle(res.data.note.title);
			setContent(res.data.note.content);
			setCreatedAt(res.data.note.createdAt);
		} catch (error) {
			if (error?.response?.data?.message) {
				console.error(error.response.data.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;

			const res = await axios.put(
				url,
				{ title, content },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (res.data.success) {
				history.push('/');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async () => {
		try {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;

			const res = await axios.delete(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (res.data.success) {
				history.push('/');
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish">
			{isLoading ? (
				<h1 className="p-4">Loading...</h1>
			) : (
				<div className="relative h-full p-4 flex flex-col md:w-11/12 md:mx-auto">

					{/* TITLE */}
					<div className="mt-5">
						<input
							type="text"
							className="outline-none w-full text-4xl font-bold bg-bg-black"
							value={title}
							onChange={(e) => {
								setIsContentEdited(true);
								setTitle(e.target.value);
							}}
						/>
						<p className="text-lg text-font-secondary mt-2">
							{createdAt}
						</p>
					</div>

					<hr className="border-[0.5px] border-font-secondary mt-5" />

					{/* CONTENT */}
					<textarea
						className="outline-none mt-2 text-lg w-full flex-1 bg-bg-black"
						value={content}
						onChange={(e) => {
							setIsContentEdited(true);
							setContent(e.target.value);
						}}
					/>

					{/* SAVE BUTTON */}
					{isContentEdited && (
						<div className="absolute bottom-10 right-5">
							<button
								className="rounded-lg bg-font-main text-bg-black font-bold p-3"
								onClick={handleEdit}
							>
								Save
							</button>
						</div>
					)}

					{/* ❌ FIX: div → button */}
					<button
						className="p-2 absolute bottom-10 left-5 rounded-lg sm:w-12 sm:h-12 text-bg-black bg-font-main"
						onClick={handleDelete}
					>
						<MdDelete size={30} />
					</button>

				</div>
			)}
		</div>
	);
};

export default FullNote;
