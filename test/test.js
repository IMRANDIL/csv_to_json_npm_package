const convertCSVtoJSON = require('../lib/index');

const csvFilePath = './imran.csv';
const jsonFilePath = 'temp.json';

(async () => {
    try {
        await convertCSVtoJSON(csvFilePath, jsonFilePath);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
