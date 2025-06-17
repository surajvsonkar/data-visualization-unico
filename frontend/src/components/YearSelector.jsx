import PropTypes from 'prop-types';

const YearSelector = ({ selectedYear, availableYears, onYearChange }) => {
	if (!availableYears || availableYears.length === 0) {
		return <div className="text-center p-2">No years available</div>;
	}

	const handleYearChange = (e) => {
		const newYear = e.target.value;
		console.log(`Year changed from ${selectedYear} to ${newYear}`);
		onYearChange(newYear);
	};

	return (
		<div className="flex justify-center mb-4">
			<div className="inline-block">
				<label
					htmlFor="year-select"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Select Year:
				</label>
				<select
					id="year-select"
					value={selectedYear}
					onChange={handleYearChange}
					className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				>
					{availableYears.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

YearSelector.propTypes = {
	selectedYear: PropTypes.string.isRequired,
	availableYears: PropTypes.array.isRequired,
	onYearChange: PropTypes.func.isRequired,
};

export default YearSelector;
