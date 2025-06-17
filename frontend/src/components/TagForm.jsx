import { useState } from 'react';
import PropTypes from 'prop-types';

const TagForm = ({ onAddTag }) => {
	const [tagName, setTagName] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!tagName.trim()) {
			setError('Tag name cannot be empty');
			return;
		}

		onAddTag(tagName.trim());
		setTagName('');
		setError('');
	};

	return (
		<form onSubmit={handleSubmit} className="mt-3">
			<h4 className="text-sm font-medium text-gray-700 mb-1">Add New Tag</h4>

			<div className="flex">
				<input
					type="text"
					value={tagName}
					onChange={(e) => setTagName(e.target.value)}
					placeholder="Enter development tag"
					className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r text-sm transition-colors"
				>
					Add
				</button>
			</div>

			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</form>
	);
};

TagForm.propTypes = {
	onAddTag: PropTypes.func.isRequired,
};

export default TagForm;
