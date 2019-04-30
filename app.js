const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const bookRouter = express.Router();
const port = process.env.PORT || 3000;


const Book = require('./models/bookModel');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api', bookRouter);

//app.use(express.json());
//app.use(express.urlencoded())



bookRouter.route('/books/:bookId')
.get((req, res) => {
  Book.findById(req.params.bookId,(err, book) => {
    if(err) {
      res.send(err);
    }

    return res.json(book);
  });
});

//curl -d '{"title": "Rich Dad Poor Dad","genre": "Financial Literacy","author": "Robart Kiosakey"}' -H "Content-Type: application/json" -X POST http://localhost:4000/api/books





bookRouter.route('/books')
  .post((request,response) => {
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

app.get('/', (req, res) => {
  res.send('Welcome to my API on port 4000!');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
