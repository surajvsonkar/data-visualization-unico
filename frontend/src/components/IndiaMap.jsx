import { useState, useEffect, useRef } from 'react';
import { geoMercator, geoPath, select, scaleLinear } from 'd3';
import PropTypes from 'prop-types';

const IndiaMap = ({ selectedYear, onStateClick }) => {
	const [indiaGeoData, setIndiaGeoData] = useState(null);
	const [gsdpData, setGsdpData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const svgRef = useRef(null);

	// Fetch India GeoJSON data
	useEffect(() => {
		console.log('Fetching GeoJSON data');
		setLoading(true);
		fetch('/api/data/geojson')
			.then((response) => {
				if (!response.ok)
					throw new Error(
						`Failed to load map data: ${response.status} ${response.statusText}`
					);
				return response.json();
			})
			.then((data) => {
				console.log('GeoJSON data loaded successfully');
				setIndiaGeoData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error loading map data:', err);
				setError('Failed to load map data. Please try again later.');
				setLoading(false);
			});
	}, []);

	// Fetch GSDP data when year changes
	useEffect(() => {
		if (!selectedYear) return;

		console.log(`Fetching GSDP data for year: ${selectedYear}`);
		setLoading(true);
		fetch(`/api/data/gsdp/${selectedYear}`)
			.then((response) => {
				if (!response.ok)
					throw new Error(
						`Failed to load GSDP data: ${response.status} ${response.statusText}`
					);
				return response.json();
			})
			.then((data) => {
				console.log(
					`GSDP data loaded for ${selectedYear}:`,
					data.length,
					'states'
				);
				setGsdpData(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error(`Error loading GSDP data for ${selectedYear}:`, err);
				setError('Failed to load GSDP data. Please try again later.');
				setLoading(false);
			});
	}, [selectedYear]); // This dependency ensures the effect runs when selectedYear changes

	// Render map when both geo data and GSDP data are available
	useEffect(() => {
		if (!indiaGeoData) {
			console.log('No GeoJSON data available yet, skipping map render');
			return;
		}

		console.log('Rendering map with:', {
			geoDataAvailable: !!indiaGeoData,
			gsdpDataLength: gsdpData?.length || 0,
			selectedYear,
		});

		const svg = select(svgRef.current);
		svg.selectAll('*').remove();

		const width = 800;
		const height = 700;

		// Create projection centered on India
		const projection = geoMercator()
			.scale(1000)
			.center([82, 23]) // Centered on India
			.translate([width / 2, height / 2]);

		const pathGenerator = geoPath().projection(projection);

		// Create a map for quick lookup of GSDP data by state name
		const gsdpByState = {};
		if (gsdpData && gsdpData.length > 0) {
			gsdpData.forEach((d) => {
				gsdpByState[d.state.toLowerCase()] = d;
			});
			console.log('GSDP data by state:', Object.keys(gsdpByState));
		}

		// Find min and max GSDP values for color scale
		let colorScale = () => '#ccc'; // Default gray if no data

		if (gsdpData && gsdpData.length > 0) {
			const gsdpValues = gsdpData.map((d) => d.gsdp);
			const minGsdp = Math.min(...gsdpValues);
			const maxGsdp = Math.max(...gsdpValues);

			console.log('GSDP range:', { minGsdp, maxGsdp });

			// Create color scale
			colorScale = scaleLinear()
				.domain([minGsdp, maxGsdp])
				.range(['#e6f2ff', '#0066cc']);
		}

		// Draw states
		svg
			.selectAll('path')
			.data(indiaGeoData.features)
			.enter()
			.append('path')
			.attr('d', pathGenerator)
			.attr('fill', (d) => {
				// Use NAME_1 property for state name
				const stateName = d.properties.NAME_1.toLowerCase();
				const stateData = gsdpByState[stateName];
				return stateData ? colorScale(stateData.gsdp) : '#ccc';
			})
			.attr('stroke', '#fff')
			.attr('stroke-width', 0.5)
			.attr('class', 'cursor-pointer hover:opacity-80 transition-opacity')
			.on('click', (event, d) => {
				// Use NAME_1 property for state name
				const stateName = d.properties.NAME_1;
				const stateData = gsdpByState[stateName.toLowerCase()];
				if (stateData) {
					onStateClick({
						...stateData,
						geoFeature: d,
					});
				}
			})
			.append('title')
			.text((d) => {
				// Use NAME_1 property for state name
				const stateName = d.properties.NAME_1;
				const stateData = gsdpByState[stateName.toLowerCase()];
				return stateData
					? `${stateName}: ₹${stateData.gsdp.toLocaleString()} Cr`
					: `${stateName}: No data`;
			});
	}, [indiaGeoData, gsdpData, onStateClick, selectedYear]); // Added selectedYear as a dependency

	if (error) {
		return <div className="text-red-500 text-center p-4">{error}</div>;
	}

	return (
		<div className="relative">
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			)}
			<svg
				ref={svgRef}
				width="100%"
				height="700"
				viewBox="0 0 800 700"
				className="mx-auto"
			></svg>

			<div className="mt-4 flex justify-center">
				<div className="flex items-center">
					<div className="w-4 h-4 bg-[#e6f2ff]"></div>
					<span className="ml-2 mr-4 text-sm">Lower GSDP</span>
					<div className="w-4 h-4 bg-[#0066cc]"></div>
					<span className="ml-2 text-sm">Higher GSDP</span>
				</div>
			</div>

			<div className="text-center text-sm mt-2 text-gray-600">
				Showing data for year: {selectedYear}
			</div>
		</div>
	);
};

IndiaMap.propTypes = {
	selectedYear: PropTypes.string.isRequired,
	onStateClick: PropTypes.func.isRequired,
};

export default IndiaMap;
