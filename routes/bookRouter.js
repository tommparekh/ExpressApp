const express = require('express');

const bookController = require('../controllers/bookController')

function routes(Book) {
  const bookRouter = express.Router();
  const controller = bookController(Book);

  // Middleware is placed using .use method. All it does is find the book from request (bookId). If found, set it in request, otherwise send error msg.
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        res.send(err);
      }

      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  })

  bookRouter.route('/books/:bookId')
    // book is already setup in req object by .use() middleware. Just return it.  
    .get((req, res) => res.json(req.book))

    // book is already setup in req object by .use() middleware. Just save it.
    .put((req, res) => {
      const {book} = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;

      // This is synchronous save() call. Should be avoided with asynchronous call. See .Patch() function.
      book.save();
      return res.json(book);
    })

    .patch((req,res) => {
      const {book} = req;

      // we dont want to update (patch) the Id of a record in mongodb. If only Id is present in request.body, then remove it.
      if(req.body._id) {
        delete req.body._id;
      }

      Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });

      // save data asynchronously.
      book.save((err) => {
        if (err) {
          return res.send(err);
        }

        return res.json(book);
      });

    })

    .delete((req,res) =>  {
      req.book.remove( (err) => {
        if(err) {
          res.send(err);
        }

        res.sendStatus(204);
      });
    });

  //curl -d '{"title": "Rich Dad Poor Dad","genre": "Financial Literacy","author": "Robart Kiosakey"}' -H "Content-Type: application/json" -X POST http://localhost:4000/api/books


  bookRouter.route('/books')
    .post(controller.post)

    .get(controller.get);

  return bookRouter;
}

module.exports = routes;