import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for the processed data
let gsdpDataByYear = {};

// Load and process the CSV data
const loadGsdpData = () => {
	return new Promise((resolve, reject) => {
		// Return cached data if available
		if (Object.keys(gsdpDataByYear).length > 0) {
			return resolve(gsdpDataByYear);
		}

		const results = [];
		fs.createReadStream(path.join(__dirname, '../data/india_gsdp.csv'))
			.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => {
				try {
					// Get all year columns from the first row
					const firstRow = results[0];
					const yearColumns = Object.keys(firstRow).filter(
						(key) => key.match(/^\d{4}-\d{2}$/) || key.match(/^\d{4}-\d{2} /)
					);

					// Process each row and organize by year
					// Process each row and organize by year
					results.forEach((row) => {
						// Skip rows without state info
						if (!row['Sl. No.'] || !row['State']) return;

						// Process each year column
						yearColumns.forEach((yearCol) => {
							if (!gsdpDataByYear[yearCol]) {
								gsdpDataByYear[yearCol] = [];
							}

							// Add data only if GSDP value exists and is not NaN
							const gsdpValue = parseFloat(row[yearCol]);
							if (!isNaN(gsdpValue)) {
								// Normalize state names to match GeoJSON properties.NAME_1
								let stateName = row['State'];

								// Add mappings for states with different names in GeoJSON
								const stateNameMap = {
									'Andhra Pradesh': 'Andhra Pradesh',
									'Arunachal Pradesh': 'Arunachal Pradesh',
									Assam: 'Assam',
									Bihar: 'Bihar',
									Chhattisgarh: 'Chhattisgarh',
									Goa: 'Goa',
									Gujarat: 'Gujarat',
									Haryana: 'Haryana',
									'Himachal Pradesh': 'Himachal Pradesh',
									'Jammu & Kashmir': 'Jammu and Kashmir',
									Jharkhand: 'Jharkhand',
									Karnataka: 'Karnataka',
									Kerala: 'Kerala',
									'Madhya Pradesh': 'Madhya Pradesh',
									Maharashtra: 'Maharashtra',
									Manipur: 'Manipur',
									Meghalaya: 'Meghalaya',
									Mizoram: 'Mizoram',
									Nagaland: 'Nagaland',
									Odisha: 'Orissa', // GeoJSON might use older name
									Punjab: 'Punjab',
									Rajasthan: 'Rajasthan',
									Sikkim: 'Sikkim',
									'Tamil Nadu': 'Tamil Nadu',
									Telangana: 'Telangana',
									Tripura: 'Tripura',
									'Uttar Pradesh': 'Uttar Pradesh',
									Uttarakhand: 'Uttarakhand',
									'West Bengal': 'West Bengal',
								};

								if (stateNameMap[stateName]) {
									stateName = stateNameMap[stateName];
								}

								gsdpDataByYear[yearCol].push({
									sl_no: row['Sl. No.'],
									state: stateName,
									state_code: row['Sl. No.'],
									gsdp: gsdpValue,
								});
							}
						});
					});

					console.log(
						`Processed GSDP data for years: ${Object.keys(gsdpDataByYear).join(
							', '
						)}`
					);
					resolve(gsdpDataByYear);
				} catch (error) {
					console.error('Error processing CSV data:', error);
					reject(error);
				}
			})
			.on('error', (error) => {
				console.error('Error reading CSV file:', error);
				reject(error);
			});
	});
};

export { loadGsdpData };
