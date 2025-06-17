# India GSDP Visualization

A web application for visualizing Gross State Domestic Product (GSDP) data across Indian states using interactive maps.

## Features

- Interactive map of India with state-wise GSDP visualization
- Year selection to view historical GSDP data
- Color-coded states based on GSDP values
- Detailed state information on click
- Responsive design for desktop and mobile devices

## Project Structure

The project consists of two main parts:

- **Frontend**: React application with D3.js for visualization
- **Backend**: Express.js server providing API endpoints for data

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or higher)
- npm (usually comes with Node.js)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/surajvsonkar/data-visualization-unico.git
```

### 2. Install dependencies

Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Return to root directory
cd ..

# Install frontend dependencies
cd frontend
npm install

# Return to root directory
cd ..
```

### 3. Create environment files

#### Backend .env file

Create a `.env` file in the `backend` directory with the following variables:

```bash
cd backend
touch .env
```

Add the following content to the `.env` file:

```
PORT=3000
# Add any database connection strings if applicable
# MONGODB_URI=mongodb://localhost:27017/india-gsdp
```

### 4. Prepare data files

Ensure you have the following data files in the correct locations:

- `backend/data/india-states.json` - GeoJSON file containing India's state boundaries
- `backend/data/india_gsdp.csv` - CSV file containing GSDP data by state and year

### 5. Start the application

You'll need to start both the backend and frontend servers:

```bash
# Start the backend server (from the root directory)
cd backend
npm start

# In a new terminal, start the frontend development server
cd frontend
npm run dev
```

The backend will run on http://localhost:3000 and the frontend will run on http://localhost:5173 (or another port if 5173 is in use).

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/data/geojson` - Returns GeoJSON data for India's states
- `GET /api/data/gsdp/years` - Returns a list of available years in the GSDP dataset
- `GET /api/data/gsdp/:year` - Returns GSDP data for all states for the specified year

## Technologies Used

### Frontend
- React
- D3.js for data visualization
- Tailwind CSS for styling

### Backend
- Express.js
- Node.js
- CSV parsing libraries
- dotenv for environment variable management

## Development

### Running in development mode

For frontend development with hot reloading:

```bash
cd frontend
npm run dev
```

For backend development with automatic restart:

```bash
cd backend
npm run dev
```

### Building for production

To build the frontend for production:

```bash
cd frontend
npm run build
```

This will create optimized production files in the `frontend/dist` directory.

## Deployment

For production deployment:

1. Build the frontend as described above
2. Start the backend server which will serve both the API and the static frontend files

```bash
cd backend
npm start
```

For production environments, make sure to update your `.env` files with appropriate values:

```
# backend/.env for production
PORT=3000
# Add any production database connection strings
```

## License

[MIT License](LICENSE)