/**
 * Initialize the 2D canvas
 */
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

/**
 * Resize listener for the window to adjust canvas size
 */
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Window resized, adjusting canvas size.');
    clearCanvas();
    drawAllTanks();
    drawMapAndTerrains().catch(error => {
        console.error('Error re-drawing map and terrains after resize:', error.message, error.stack);
    });
});

/**
 * Object to store tank representations
 */
const tanks = {};

/**
 * Function to add a tank to the canvas
 * @param {string} tankId - The ID of the tank
 * @param {object} position - The position of the tank
 * @param {string} color - The color of the tank
 */
function addTank(tankId, position, color = 'green') {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        console.error(`Invalid position for tank ID ${tankId}:`, position);
        return;
    }
    tanks[tankId] = { position, color };
    // Draw the tank immediately upon adding
    drawTank(tankId);
    console.log(`Tank with ID ${tankId} added at position (${position.x}, ${position.y}).`);
}

/**
 * Function to draw a tank
 * @param {string} tankId - The ID of the tank
 */
function drawTank(tankId) {
    if (!tanks[tankId]) return;
    const { position, color } = tanks[tankId];
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        console.error(`Invalid tank position for tank ID ${tankId}:`, position);
        return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, 50, 30); // Drawing tank as a rectangle for simplicity
}

/**
 * Function to clear the canvas
 */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Function to draw all tanks
 */
function drawAllTanks() {
    Object.keys(tanks).forEach(drawTank);
}

/**
 * Function to fetch map data
 * @param {string} mapId - The ID of the map
 * @returns {object|null} - The map data or null if an error occurs
 */
async function fetchMapData(mapId) {
    try {
        const response = await fetch(`/api/maps/${mapId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const mapData = await response.json();
        if (!mapData || !Array.isArray(mapData.terrainLayouts)) {
            console.error('Map data is invalid or missing terrain layouts');
            return null;
        }
        return mapData;
    } catch (error) {
        console.error(`Could not fetch map data: ${error.message}`, error.stack);
        return null;
    }
}

/**
 * Function to draw terrain
 * @param {array} terrainLayout - The layout of the terrain
 */
function drawTerrain(terrainLayout) {
    if (!Array.isArray(terrainLayout)) {
        console.error('Invalid terrain layout data');
        return;
    }
    terrainLayout.forEach(layout => {
        if (typeof layout !== 'object' || !layout.terrain || typeof layout.x !== 'number' || typeof layout.y !== 'number' || typeof layout.width !== 'number' || typeof layout.height !== 'number') {
            console.error('Invalid terrain layout object:', layout);
            return;
        }
        switch (layout.terrain.type) {
            case 'forest':
                ctx.fillStyle = 'green';
                break;
            case 'hill':
                ctx.fillStyle = 'brown';
                break;
            case 'city':
                ctx.fillStyle = 'grey';
                break;
            default:
                ctx.fillStyle = 'black';
        }
        ctx.fillRect(layout.x, layout.y, layout.width, layout.height);
    });
}

/**
 * Function to draw map and terrains
 * @param {string} mapId - The ID of the map
 */
async function drawMapAndTerrains(mapId) {
    const mapData = await fetchMapData(mapId);
    if (!mapData) {
        console.error('Failed to draw map and terrains: No map data');
        return;
    }
    clearCanvas(); // Clear the canvas before drawing the new map
    // Adjusted to draw terrains based on terrainLayouts
    if (mapData.terrainLayouts && Array.isArray(mapData.terrainLayouts)) {
        drawTerrain(mapData.terrainLayouts);
    } else {
        console.error('Map data does not contain valid terrain layouts:', mapData);
    }
}

/**
 * Start the rendering loop by drawing all tanks initially
 */
drawAllTanks();

console.log('2D visualization initialized.');

/**
 * Export functions to control the simulation from outside
 */
import { convertResultsToArray } from './simulationUtils.js';

export const visualizationApi = {
    addTank,
    drawMapAndTerrains
};