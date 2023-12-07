const path = require('path');

module.exports = [
    // App 1 conf
    {
        entry: path.resolve(__dirname, 'extensions/better-gpt/main.js'),
        output: {
            filename: 'better-gpt.build.js',
            path: path.resolve(__dirname, 'app/'), // Can be the same dir and name, webpack automatically overwrites the file
        },
    }
];
