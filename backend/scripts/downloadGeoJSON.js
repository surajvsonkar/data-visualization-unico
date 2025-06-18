import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URL to a public GeoJSON file for India states
const geoJsonUrl = 'https://raw.githubusercontent.com/geohacker/india/master/states/india_state.geojson';
const outputPath = path.join(__dirname, '../data/india-states.json');

console.log(`Downloading India states GeoJSON from ${geoJsonUrl}`);
console.log(`Output path: ${outputPath}`);

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  console.log(`Creating directory: ${dataDir}`);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Download the file
https.get(geoJsonUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: ${response.statusCode} ${response.statusMessage}`);
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
      
      // Write to file
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
      console.log(`Successfully downloaded and saved GeoJSON to ${outputPath}`);
    } catch (error) {
      console.error('Error processing GeoJSON:', error);
    }
  });
}).on('error', (error) => {
  console.error('Error downloading GeoJSON:', error);
});