import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Create = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isContentTyped, setIsContentTyped] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const history = useHistory();

	const { isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (isLoggedIn) setIsLoading(false);
	}, [isLoggedIn]);

	const handleNewNote = () => {
		if (title.trim() !== '' && content.trim !== '') {
			const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/notes`;
			const body = { title, content };
			const options = {
				withCredentials: true,
				Credential: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			};
			axios
				.post(url, body, options)
				.then((res) => {
					if (res.data.success) {
						history.push('/');
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}

		history.push('/');
	};
	return (
		<div className="h-screen bg-bg-black text-font-main font-Mulish ">
			{isLoading ? (
				<h1>Checking Credentials</h1>
			) : (
				<div className="relative h-full p-4 flex flex-col md:w-11/12 md:mx-auto">
					{/* TITLE */}
					<div className="mt-5">
						<input
							type="text"
							className="outline-none w-full text-4xl font-bold bg-bg-black text-font-main"
							placeholder="Note Title"
							value={title}
							onChange={(e) => {
								setIsContentTyped(true);
								setTitle(e.target.value);
							}}
						/>
					</div>
					<hr className=" border-[0.5px] border-font-secondary mt-5" />
					{/* Content */}
					<textarea
						className="outline-none mt-2 text-lg w-full flex-1 bg-bg-black text-font-main"
						defaultValue={content}
						placeholder="Whats new?"
						onChange={(e) => {
							setIsContentTyped(true);
							setContent(e.target.value);
						}}
					></textarea>
					{isContentTyped && (
						<div className="absolute bottom-10 right-10">
							<button
								className=" rounded-lg bg-font-main text-bg-black font-bold p-3 "
								onClick={handleNewNote}
							>
								Save
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Create;
