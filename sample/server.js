const express = require('express');

const app = express();

app.use(express.static('public'));

app.post('/submit', (req, res) => res.json('success'));

app.listen(3000, () => console.log('Server started on port 3000'));
