const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

console.log(process.env.ENV);
if (process.env.ENV === 'TEST') {
  console.log('This is a TEST DB');
  const db = mongoose.connect('mongodb://localhost/bookAPI-TEST');
} else {
  console.log('This is a PROD DB');
  const db = mongoose.connect('mongodb://localhost/bookAPI-PROD');
}
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');

// Pass Book to routes function in ./routes/bookRouter.js
const bookRouter = require('./routes/bookRouter')(Book);


//Order of bodyParser and Router use must be preserved.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API on port 4000!');
});

// app.listen returns server. get a handle so it can be closed from test files.
app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

module.exports = app;