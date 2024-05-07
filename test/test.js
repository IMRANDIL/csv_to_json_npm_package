const convertCSVtoJSON = require('../lib/index');

const csvFilePath = '../creditcard.csv';
const jsonFilePath = 'temp.json';

(async () => {
    try {
        await convertCSVtoJSON(csvFilePath, jsonFilePath);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
