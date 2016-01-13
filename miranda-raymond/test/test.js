const chai = require('chai');
const expect = chai.expect;
const request = chai.request;
const chaiHttp = require('chai-http');
const fs = require('fs');

const httpServer = require(__dirname + '/../server');

chai.use(chaiHttp);

describe('http server', () => {
  it('should respond to GET requests on /index page', (done) => {
    chai.request('localhost:3000')
      .get('/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  describe('the index', () => {
    before((done) => {
      fs.readFile(__dirname + '/../public/index.html', (err, data) => {
        this.index = data.toString();
        done();
      });
    });

    it('should return the index.html file to GET requests', (done) => {
      chai.request('localhost:3000')
        .get('/')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.text).to.eql(this.index);
          done();
        });
    });
  });

  it('should respond to GET requests with the time at /time', (done) => {
    var whatTime = 'Current date and time: ' + new Date();
    chai.request('localhost:3000')
      .get('/time')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql(timeTest);
        done();
      });
  });

  it('should respond to GET requests with a name at /greet/[name]', (done) => {
    var nameTest = 'Hi there, ' + this.name + '!';
    chai.request('localhost:3000')
      .get('/greet/' + this.name)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.eql(nameTest);
        done();
      });
  });

  it('should give 404 error to GET requests at unknown request', (done) => {
    chai.request('localhost:3000')
      .get('/doesnotexist')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(404);
        expect(res.body.msg).to.eql('Page not found');
        done();
      });
  });
});
