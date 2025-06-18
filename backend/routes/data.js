import express from 'express';
import { loadGsdpData } from '../utils/dataLoader.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET /api/data/geojson - Get India states GeoJSON
router.get('/geojson', async (req, res) => {
	try {
		const filePath = path.join(__dirname, '../data/india-states.json');

		// Check if file exists
		if (!fs.existsSync(filePath)) {
			console.error(`GeoJSON file not found at: ${filePath}`);
			return res.status(404).json({ 
				message: 'GeoJSON file not found',
				path: filePath,
				currentDir: __dirname
			});
		}

		// Read and send the file
		const geoJsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		res.json(geoJsonData);
	} catch (error) {
		console.error('Error fetching GeoJSON data:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// GET /api/data/gsdp/years - Get all available years
router.get('/gsdp/years', async (req, res) => {
	try {
		const gsdpData = await loadGsdpData();
		res.json(Object.keys(gsdpData));
	} catch (error) {
		console.error('Error fetching GSDP years:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

// GET /api/data/gsdp/:year
// GET /api/data/gsdp/:year
router.get('/gsdp/:year', async (req, res) => {
	try {
		const { year } = req.params;
		console.log(`Backend: Received request for GSDP data for year ${year}`);

		const gsdpData = await loadGsdpData();
		const availableYears = Object.keys(gsdpData);

		console.log(`Available years: ${availableYears.join(', ')}`);
		console.log(`Requested year: ${year}`);

		// Check if the exact year exists
		if (gsdpData[year]) {
			console.log(
				`Found exact match for year ${year}, returning ${gsdpData[year].length} records`
			);
			return res.json(gsdpData[year]);
		}

		// Try to find a matching year (e.g., if user enters "2017" but data is stored as "2017-18")
		const matchingYear = availableYears.find((y) => y.startsWith(year));
		if (matchingYear) {
			console.log(
				`Found partial match ${matchingYear} for year ${year}, returning ${gsdpData[matchingYear].length} records`
			);
			return res.json(gsdpData[matchingYear]);
		}

		// No matching year found
		console.log(`No data found for year ${year}`);
		return res.json([]);
	} catch (error) {
		console.error('Error fetching GSDP data:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

export default router;

