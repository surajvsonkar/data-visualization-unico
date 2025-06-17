import { useState, useEffect } from 'react';
import IndiaMap from './components/IndiaMap.jsx';
import StateCard from './components/StateCard.jsx';
import YearSelector from './components/YearSelector.jsx';

function App() {
	const [selectedYear, setSelectedYear] = useState('2021-22');
	const [availableYears, setAvailableYears] = useState([]);
	const [selectedState, setSelectedState] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch available years on component mount
	useEffect(() => {
		console.log('Fetching available years');
		fetch('/api/data/gsdp/years')
			.then((response) => {
				if (!response.ok) throw new Error('Failed to load years data');
				return response.json();
			})
			.then((years) => {
				console.log('Available years:', years);
				setAvailableYears(years);
				if (years.length > 0 && !years.includes(selectedYear)) {
					const mostRecentYear = years[years.length - 1];
					console.log(`Setting most recent year: ${mostRecentYear}`);
					setSelectedYear(mostRecentYear);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error loading years data:', err);
				setLoading(false);
			});
	}, []);

	const handleYearChange = (year) => {
		console.log(`App: Year changed to ${year}`);
		setSelectedYear(year);
		// Clear selected state when year changes
		setSelectedState(null);
	};

	const handleStateClick = (state) => {
		console.log('State clicked:', state);
		setSelectedState(state);
	};

	const handleCloseCard = () => {
		setSelectedState(null);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<header className="mb-6">
				<h1 className="text-3xl font-bold text-center text-blue-800">
					India GSDP Visualization
				</h1>
				<p className="text-center text-gray-600 mt-2">
					Explore state-wise Gross State Domestic Product data
				</p>
			</header>

			<div className="max-w-7xl mx-auto">
				{loading ? (
					<div className="text-center p-4">Loading available years...</div>
				) : (
					<>
						<YearSelector
							selectedYear={selectedYear}
							availableYears={availableYears}
							onYearChange={handleYearChange}
						/>

						<div className="flex flex-col md:flex-row gap-6 mt-4 justify-center">
							<div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
								<IndiaMap
									selectedYear={selectedYear}
									onStateClick={handleStateClick}
								/>
							</div>

							{selectedState && (
								<div className="w-full md:w-1/3">
									<StateCard state={selectedState} onClose={handleCloseCard} />
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default App;
