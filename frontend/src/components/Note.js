import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const Note = ({ bgColor, note }) => {
	const history = useHistory();

	return (
		<div
			className={`cursor-pointer w-full p-4 mb-4 ${bgColor} text-bg-black rounded-lg sm:w-1/4 sm:inline-block sm:mr-4 md:w-1/5`}
			onClick={() => history.push(`/${note._id}`)}
		>
			<h3 className="text-2xl font-semibold truncate">{note.title}</h3>
			<p className="mt-3 h-6 truncate sm:h-20 sm:overflow-hidden sm:whitespace-normal">
				{note.content}
			</p>
		</div>
	);
};

Note.propTypes = {
	bgColor: PropTypes.string,
	note: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired,
	}).isRequired,
};

export default Note;
