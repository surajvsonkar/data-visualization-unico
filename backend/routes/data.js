import express from 'express';
import { loadGsdpData } from '../utils/dataLoader.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Cache for GeoJSON data
let cachedGeoJson = null;

// Function to fetch GeoJSON from a public URL
const fetchGeoJsonFromUrl = () => {
  return new Promise((resolve, reject) => {
    // URL to a public GeoJSON file for India states
    const geoJsonUrl = 'https://raw.githubusercontent.com/geohacker/india/master/states/india_state.geojson';
    
    https.get(geoJsonUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          // Validate that it's valid JSON
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// GET /api/data/geojson - Get India states GeoJSON
router.get('/geojson', async (req, res) => {
    try {
        // Try to read from local file first
        const filePath = path.join(__dirname, '../data/india-states.json');
        
        // If we have cached data, return it
        if (cachedGeoJson) {
            return res.json(cachedGeoJson);
        }
        
        // Try to read from local file
        if (fs.existsSync(filePath)) {
            try {
                const geoJsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                cachedGeoJson = geoJsonData; // Cache the data
                return res.json(geoJsonData);
            } catch (fileError) {
                console.error('Error reading local GeoJSON file:', fileError);
                // Continue to fetch from URL if local file read fails
            }
        }
        
        // If local file doesn't exist or can't be read, fetch from URL
        console.log('Local GeoJSON file not found, fetching from URL');
        const geoJsonData = await fetchGeoJsonFromUrl();
        cachedGeoJson = geoJsonData; // Cache the data
        
        // Try to save to local file for future use
        try {
            const dataDir = path.dirname(filePath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(filePath, JSON.stringify(geoJsonData, null, 2));
            console.log('Saved GeoJSON to local file for future use');
        } catch (saveError) {
            console.error('Could not save GeoJSON to local file:', saveError);
            // Continue even if saving fails
        }
        
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


