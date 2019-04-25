const express = require('express');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const bookRouter = express.Router();
const port = process.env.PORT || 3000;


const Book = require('./models/bookModel');

bookRouter.route('/books/:bookId')
.get((req, res) => {
  Book.findById(req.params.bookId,(err, book) => {
    if(err) {
      res.send(err);
    }

    return res.json(book);
  });
});

bookRouter.route('/books')
  .get((req, res) => {
  //  let query = {genre: 'Fantacy'};
  //  const {query} = req;
  //  console.log(req);

    const query = {};
    if(req.query.genre) {
      query.genre = req.query.genre;
    }

    Book.find(query,(err, books) => {
      if(err) {
        res.send(err);
      }

      return res.json(books);
    });
  });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my API on port 4000!');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
