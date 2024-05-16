function convertResultsToArray(results) {
    if (typeof results === 'object' && !Array.isArray(results)) {
        console.log('Converting simulation results from object to array format.');
        return Object.keys(results).map(key => {
            const result = results[key];
            console.log('Processing result:', result);
            if (result && result.position && typeof result.position.x === 'number' && typeof result.position.y === 'number') {
                return {
                    tankId: key,
                    position: result.position,
                    status: result.status
                };
            } else {
                console.error('Invalid result format:', result);
                return null;
            }
        }).filter(result => result !== null);
    } else {
        return results.filter(result => {
            if (result && result.position && typeof result.position.x === 'number' && typeof result.position.y === 'number') {
                return true;
            } else {
                console.error('Invalid result format:', result);
                return false;
            }
        });
    }
}

export { convertResultsToArray };