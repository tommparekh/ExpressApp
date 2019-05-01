const should = require('should');
const sinon = require('sinon');
const bookController = require('../controllers/bookController');

describe('Book Controller Test:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', () => {

      // Create dummy request params

      // Dummy book
      const Book = function(book) {this.save = () => {

      }};
      
      // Dummy Request
      const req = {
        body: {
          author:'Jon'
        }
      };

      // Dummy Response
      const res = {
        status:sinon.spy(),
        send:sinon.spy(),
        json:sinon.spy()
      };

      // call code to perform test
      const controller = bookController(Book);
      controller.post(req, res);

      // If response=400, good else throw error for creating a book entry without title
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Title is required).should.equal(true);')

    });
  });
});
