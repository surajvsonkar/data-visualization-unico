import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TagList from './TagList';
import TagForm from './TagForm';

const StateCard = ({ state, onClose }) => {
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch tags for the selected state
	useEffect(() => {
		if (!state) return;

		setLoading(true);
		fetch(`/api/tags/${state.state_code}`)
			.then((response) => {
				if (!response.ok) throw new Error('Failed to load tags');
				return response.json();
			})
			.then((data) => {
				setTags(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error loading tags:', err);
				setError('Failed to load tags. Please try again later.');
				setLoading(false);
			});
	}, [state]);

	const handleUpvote = async (tagId) => {
		try {
			const response = await fetch(`/api/tags/upvote/${tagId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) throw new Error('Failed to upvote tag');

			const updatedTag = await response.json();

			// Update the tags list with the updated tag
			setTags(
				tags.map((tag) => (tag._id === updatedTag._id ? updatedTag : tag))
			);
		} catch (err) {
			console.error('Error upvoting tag:', err);
			setError('Failed to upvote tag. Please try again later.');
		}
	};

	const handleAddTag = async (tagName) => {
		try {
			const response = await fetch('/api/tags', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					state_code: state.state_code,
					tag_name: tagName,
				}),
			});

			if (!response.ok) throw new Error('Failed to add tag');

			const newTag = await response.json();

			// Add the new tag to the list
			setTags([...tags, newTag]);
		} catch (err) {
			console.error('Error adding tag:', err);
			setError('Failed to add tag. Please try again later.');
		}
	};

	if (!state) return null;

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold text-blue-800">{state.state}</h2>
				<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
					✕
				</button>
			</div>

			<div className="mb-4 p-3 bg-blue-50 rounded-md">
				<h3 className="font-semibold text-blue-800 mb-1">GSDP Information</h3>
				<p className="text-gray-700">
					<span className="font-medium">GSDP Value:</span> ₹
					{state.gsdp.toLocaleString()} Cr
				</p>
			</div>

			<div className="mb-4">
				<h3 className="font-semibold text-blue-800 mb-2">Development Tags</h3>

				{error && <div className="text-red-500 text-sm mb-2">{error}</div>}

				{loading ? (
					<div className="text-center p-4">
						<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
					</div>
				) : (
					<>
						<TagList tags={tags} onUpvote={handleUpvote} />
						<TagForm onAddTag={handleAddTag} />
					</>
				)}
			</div>
		</div>
	);
};

StateCard.propTypes = {
	state: PropTypes.shape({
		state: PropTypes.string.isRequired,
		state_code: PropTypes.string.isRequired,
		gsdp: PropTypes.number.isRequired,
		geoFeature: PropTypes.object,
	}),
	onClose: PropTypes.func.isRequired,
};

export default StateCard;
