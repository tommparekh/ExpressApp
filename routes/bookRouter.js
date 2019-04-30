const express = require('express');

function routes(Book) {
  const bookRouter = express.Router();

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      Book.findById(req.params.bookId, (err, book) => {
        if (err) {
          res.send(err);
        }

        return res.json(book);
      });
    })

    .put((req,res) => {
      Book.findById(req.params.bookId, (err, book) => {
        if (err) {
          res.send(err);
        }

        book.title = req.body.title;
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.read = req.body.read;

        book.save();
        return res.json(book);
      });
    });

  //curl -d '{"title": "Rich Dad Poor Dad","genre": "Financial Literacy","author": "Robart Kiosakey"}' -H "Content-Type: application/json" -X POST http://localhost:4000/api/books


  bookRouter.route('/books')
    .post((request, response) => {
      const book = new Book(request.body);
      console.log(book);
      book.save();

      return response.status(201).json(book);
    })

    .get((req, res) => {
      //  let query = {genre: 'Fantacy'};
      //  const {query} = req;
      //  console.log(req);

      const query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }

      Book.find(query, (err, books) => {
        if (err) {
          res.send(err);
        }

        return res.json(books);
      });
    });

    return bookRouter;
}

module.exports = routes;