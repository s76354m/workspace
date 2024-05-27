# Tank_Simulation

Tank_Simulation is a web-based application designed to simulate dynamic and statistically realistic tank battles. The application serves both educational and entertainment purposes, allowing users to learn about tank capabilities and historical battle tactics in a controlled, simulated environment.

## Overview

Tank_Simulation is built using the following technologies:

- **Backend:** Node.js with Express
- **Database:** MongoDB with Mongoose ORM
- **Frontend:** Vanilla JavaScript and Bootstrap
- **View Engine:** EJS
- **3D Animation Engine:** A free-to-use engine compatible with web technologies

The project structure is organized as follows:

- **models/**: Contains Mongoose schemas for User, Tank, Terrain, and Map.
- **routes/**: Contains route definitions for authentication, tank management, terrain management, map management, and simulation.
- **views/**: Contains EJS templates for rendering the frontend.
- **public/**: Contains static assets like CSS and JavaScript files.
- **utils/**: Contains the simulation engine logic.
- **seeders/**: Contains scripts for seeding the database with initial data.
- **.env**: Environment configuration file.
- **server.js**: Entry point of the application.
- **package.json**: Project metadata and dependencies.

## Features

- **User Interaction:**
  - Select tanks for Allies and Axis sides.
  - Choose a map with various terrains.
  - Position tanks on the map.
  - Run the simulation autonomously.
- **Simulation Setup Page:**
  - Form to select tank types, quantities, and map.
  - Interface to position tanks.
  - "Start Simulation" button to initiate the battle.
- **Simulation Execution:**
  - 3D animation of tank movements, engagements, and outcomes.
  - Simulation based on tank statistics, environmental factors, and random elements.
- **Result Analysis:**
  - Summary of the battle, including shots fired, tank damage, and tanks knocked out.
- **Admin Tool:**
  - Secure interface for adding new tank types and adjusting their statistics.

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
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required settings.
4. Seed the database:
   ```sh
   node seeders/tankSeeder.js
   node seeders/mapTerrainSeeder.js
   ```
5. Start the application:
   ```sh
   npm start
   ```
6. Open your browser and navigate to `http://localhost:3000` to access the application.

### License

Copyright (c) 2024.
