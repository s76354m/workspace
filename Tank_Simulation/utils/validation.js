function validateTerrainData(terrain) {
  try {
    if (!terrain.type || ['x', 'y', 'z'].some(coord => terrain[coord] === undefined || isNaN(terrain[coord]))) {
      console.error('Terrain data missing type or coordinates property:', terrain);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error validating terrain data:', error.message);
    console.error(error.stack);
    return false;
  }
}

module.exports = { validateTerrainData };