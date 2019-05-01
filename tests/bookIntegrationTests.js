require('should');

const request = require('supertest');
const mongoose = require('mongoose');

//set process.env.ENV before requiring app.js. Else the variable value will be ignored.
process.env.ENV = 'TEST';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book Crud Test', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = { title: 'My Book', author: 'Me', genre: 'Technical' };

    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, results) => {
        //   console.log(results);
        results.body.read.should.not.equal('false');
        results.body.should.have.property('_id');
        done();
      });
  });

  // after every test iteration, delete any data created.
  afterEach((done) => {
    Book.deleteMany({}).exec();
    done();
  });

  // closes connection at the end of the test.
  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  })
});



