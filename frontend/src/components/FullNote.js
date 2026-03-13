import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const FullNote = () => {
	const [title, setTitle] = useState();
	const [content, setContent] = useState();
	const [isContentEdited, setIsContentEdited] = useState(false);
	const [createdAt, setCreatedAt] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState();

	const history = useHistory();
	const { id } = useParams();

	const { isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (isLoggedIn) getNote();
	}, [isLoggedIn]);

	// Functions
	const getNote = () => {
		const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;
		const options = {
			withCredentials: true,
			Credential: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		axios
			.get(url, options)
			.then((res) => {
				setTitle(res.data.note.title);
				setContent(res.data.note.content);
				setCreatedAt(res.data.note.createdAt);
				setIsLoading(false);
			})
			.catch((error) => {
				// redirect to 404
				if (!error.response.data.success) {
					console.log(error.response.data);

					setError(error.response.data.message);
				}
				setIsLoading(false);
			});
	};
	const handleEdit = () => {
		const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;
		const body = { title, content };
		const options = {
			withCredentials: true,
			Credential: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		axios
			.put(url, body, options)
			.then((res) => {
				if (res.data.success) {
					history.push('/');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleDelete = () => {
		const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes/${id}`;
		const options = {
			withCredentials: true,
			Credential: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};
		axios
			.delete(url, options)
			.then((res) => {
				if (res.data.success) {
					history.push('/');
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish ">
			{isLoading ? (
				<h1>Loading...</h1>
			) : (
				<div className="relative h-full p-4 flex flex-col md:w-11/12 md:mx-auto">
					{/* TITLE */}
					<div className="mt-5">
						<input
							type="text"
							className="outline-none w-full text-4xl font-bold bg-bg-black text-font-main"
							value={title}
							onChange={(e) => {
								setIsContentEdited(true);
								setTitle(e.target.value);
							}}
						/>
						<p className="text-lg text-font-secondary mt-2">{createdAt}</p>
					</div>
					<hr className=" border-[0.5px] border-font-secondary mt-5" />
					{/* Content */}
					<textarea
						className="outline-none mt-2 text-lg w-full flex-1 bg-bg-black text-font-main"
						defaultValue={content}
						onChange={(e) => {
							setIsContentEdited(true);
							setContent(e.target.value);
						}}
					></textarea>

					{isContentEdited && (
						<div className="absolute bottom-10 right-5">
							<button
								className=" rounded-lg bg-font-main text-bg-black font-bold p-3 "
								onClick={handleEdit}
							>
								Save
							</button>
						</div>
					)}
					<div
						className="p-2 absolute bottom-10 left-5 rounded-lg sm:w-12 sm:h-12  text-bg-black  bg-font-main"
						onClick={handleDelete}
					>
						<MdDelete size={30} />
					</div>
				</div>
			)}
		</div>
	);
};

export default FullNote;
