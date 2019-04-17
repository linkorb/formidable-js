const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'formidable.js'),
  output: {
    filename: 'formidable.min.js',
    path: path.join(__dirname, 'dist')
  }
};
