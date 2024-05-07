# CSV to JSON Converter

A simple npm package for generating a JSON file (.json) from a CSV file.

## Installation

You can install the package via npm:

```bash
npm install @imrandil/csv_to_json
```

## Usage

```javascript
const convertCSVtoJSON = require('@imrandil/csv_to_json');

const csvFilePath = 'example.csv';
const jsonFilePath = 'output.json';

(async () => {
    try {
        await convertCSVtoJSON(csvFilePath, jsonFilePath);
        console.log('CSV converted to JSON. JSON file saved:', jsonFilePath);
    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
    }
})();
```

## API

### convertCSVtoJSON(csvFilePath, jsonFilePath)

Converts a CSV file to a JSON file.

- `csvFilePath` (string): The path to the CSV file.
- `jsonFilePath` (string): The path to save the JSON file.

Returns a Promise that resolves when the conversion is complete.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
