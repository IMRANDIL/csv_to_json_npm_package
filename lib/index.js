const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');

/**
 * Converts a CSV file to JSON.
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {string} jsonFilePath - The path to save the JSON file.
 * @returns {Promise<void>} A Promise that resolves when conversion is complete.
 */
async function convertCSVtoJSON(csvFilePath, jsonFilePath) {
    try {
        // Check if csvFilePath is provided and it's a string
        if (typeof csvFilePath !== 'string' || csvFilePath.trim() === '') {
            throw new Error('Invalid or missing CSV file path.');
        }

        // Check if jsonFilePath is provided and it's a string
        if (typeof jsonFilePath !== 'string' || jsonFilePath.trim() === '') {
            throw new Error('Invalid or missing JSON file path.');
        }

         // Check if the extension of csvFilePath is '.csv'
         if (path.extname(csvFilePath).toLowerCase() !== '.csv') {
            throw new Error(`Invalid file extension for CSV file: ${path.extname(csvFilePath)}. Required extension: .csv`);
        }

        // Check if the extension of jsonFilePath is '.json'
        if (path.extname(jsonFilePath).toLowerCase() !== '.json') {
            throw new Error(`Invalid file extension for JSON file: ${path.extname(jsonFilePath)}. Required extension: .json`);
        }

        // Check if the CSV file exists
        if (!fs.existsSync(csvFilePath)) {
            throw new Error(`CSV file "${csvFilePath}" does not exist.`);
        }
        const readStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' });
        const writeStream = fs.createWriteStream(jsonFilePath);

        // Write the opening bracket of the JSON array
        writeStream.write('[\n');

        let isFirstRow = true;

        readStream
            .pipe(splitRows()) // Split CSV rows
            .pipe(csvToJson()) // Convert CSV rows to JSON
            .on('data', (jsonObj) => {
                // Write JSON object to file
                const jsonStr = JSON.stringify(jsonObj, null, 2);
                const lastRow = isFirstRow ? '' : ',\n'; // Add comma for all rows except the first
                writeStream.write(lastRow + jsonStr);
                isFirstRow = false;
            })
            .on('end', () => {
                // Write the closing bracket of the JSON array
                writeStream.write('\n]');
                writeStream.end();
                console.log('CSV converted to JSON. JSON file saved:', jsonFilePath);
            })
            .on('error', (error) => {
                console.error('Error converting CSV to JSON:', error);
                writeStream.end();
            });
    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
    }
}

// Helper function to split CSV rows
function splitRows() {
    let buffer = '';
    return new Transform({
        readableObjectMode: true,
        transform(chunk, encoding, callback) {
            buffer += chunk;
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop();
            for (const line of lines) {
                this.push(line);
            }
            callback();
        },
        flush(callback) {
            if (buffer) {
                this.push(buffer);
            }
            callback();
        },
    });
}

// Helper function to convert CSV rows to JSON
function csvToJson() {
    let headers = [];
    return new Transform({
        writableObjectMode: true,
        readableObjectMode: true,
        transform(chunk, encoding, callback) {
            const rows = chunk.split(',');
            if (!headers.length) {
                headers = rows.map((header) => header.trim().replace(/"/g, '')); // Remove double quotes from headers
            } else {
                const jsonObj = {};
                rows.forEach((row, index) => {
                    jsonObj[headers[index]] = row.trim().replace(/"/g, ''); // Remove double quotes from values
                });
                this.push(jsonObj);
            }
            callback();
        },
    });
}

module.exports = convertCSVtoJSON;
