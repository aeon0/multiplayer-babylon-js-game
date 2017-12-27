const express = require('express');
const path = require('path');
const app = express();

app.use('/public', express.static('./public'));
app.use('/node_modules', express.static('./node_modules'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.listen(8700);
console.log('Listening on Port: 8700');