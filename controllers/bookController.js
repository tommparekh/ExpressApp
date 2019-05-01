
//This is reveling module pattern where functions are exposed to outside world

function bookController(Book) {
  function post(req, res) {
    const book = new Book(req.body);

    // Condition added per the test case to ensure the book without title is not saved.
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    book.save();

    // res.status and .json are split into two for testing.
    res.status(201);
    return res.json(book);
  }

  function get(req, res) {
    //  let query = {genre: 'Fantacy'};
    //  const {query} = req;
    //  console.log(req);

    /** This code can be optimized with destructuring.
    {
      const query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
    }
    */

    const {query} = req;

    // Book.find((err, books) => {
    Book.find(query, (err, books) => {
      if (err) {
        res.send(err);
      }

      // extending code for hypermedia
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });

      return res.json(returnBooks);
    });
  }

  // exposes functions from the controller to be exposed to outside world
  return { post, get };
}

module.exports = bookController;