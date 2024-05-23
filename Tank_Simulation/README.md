# Tank_Simulation

Tank_Simulation is a web-based application that simulates tank battles. It combines educational purposes with entertainment by allowing users to set up and visualize historically accurate tank battles in a 3D environment. Users can learn about tank capabilities and historical battle tactics in a controlled, simulated environment.

## Overview

The Tank_Simulation project uses a modern web architecture with the following technologies:

- **Backend:** Node.js with Express
- **Database:** MongoDB with Mongoose ORM
- **Frontend:** Vanilla JavaScript and Bootstrap
- **View Rendering:** EJS
- **3D Animation Engine:** THREE.js

### Project Structure

- **models/**: Mongoose models for User, Tank, Terrain, and Map
- **routes/**: Express routes for authentication, tank management, terrain management, map management, setup, and simulation
- **views/**: EJS templates for rendering HTML pages
- **public/**: Static files including JavaScript, CSS, and bundled assets
- **seeders/**: Scripts for seeding the database with initial data
- **services/**: Business logic for the simulation
- **controllers/**: Controllers for handling simulation logic
- **.env**: Environment variables
- **server.js**: Main entry point for the application
- **webpack.config.js**: Webpack configuration for bundling frontend assets

## Features

- **User Interaction**: Users can select tanks for the Allies and Axis, choose a map, and position tanks on the map.
- **Simulation Setup Page**: A form to select tank types and quantities, choose a map, and position tanks.
- **Simulation Execution**: The simulation runs autonomously with 3D animation showing tank movements, engagements, and outcomes.
- **Result Analysis**: A summary of the battle with statistics such as shots fired, tank damage, and tanks knocked out.
- **Admin Tool**: Secure interface for administrators to add new tank types and adjust their statistics.

## Getting started

### Requirements

- Node.js
- MongoDB

### Quickstart

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd Tank_Simulation
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Set up the environment variables:
   - Copy the `.env.example` to `.env`
   - Fill in the required values in the `.env` file
4. Seed the database with initial data:
   ```sh
   node seeders/tankSeeder.js
   node seeders/mapTerrainSeeder.js
   ```
5. Start the application:
   ```sh
   npm start
   ```

### License

The project is proprietary (not open source). Copyright (c) 2024.