import PropTypes from 'prop-types';

const TagList = ({ tags, onUpvote }) => {
	if (tags.length === 0) {
		return (
			<div className="text-gray-500 text-center py-2">
				No tags yet. Be the first to add one!
			</div>
		);
	}

	return (
		<ul className="space-y-2 mb-4">
			{tags.map((tag) => (
				<li
					key={tag._id}
					className="flex items-center justify-between bg-gray-50 p-2 rounded"
				>
					<span className="text-gray-800">{tag.tag_name}</span>
					<div className="flex items-center">
						<span className="text-gray-600 mr-2">{tag.upvotes}</span>
						<button
							onClick={() => onUpvote(tag._id)}
							className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm transition-colors"
						>
							Upvote
						</button>
					</div>
				</li>
			))}
		</ul>
	);
};

TagList.propTypes = {
	tags: PropTypes.arrayOf(
		PropTypes.shape({
			_id: PropTypes.string.isRequired,
			tag_name: PropTypes.string.isRequired,
			upvotes: PropTypes.number.isRequired,
		})
	).isRequired,
	onUpvote: PropTypes.func.isRequired,
};

export default TagList;
