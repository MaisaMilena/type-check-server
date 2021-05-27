process.env.NODE_ENV = 'test';
require('dotenv').config();

const utils = require('../utils');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;
var assert = chai.assert;


let url = "http://localhost:"+process.env.TEST_PORT;

const type_check_success = (res) => {
  const checked_success = "All terms check.\n";
  const end = res.slice(-17);
  expect(end).to.equal(checked_success)
}

const type_check_fails = (res) => {
  const checked_success = "All terms check.\n";
  const end = res.slice(-17);
  expect(end).to.not.equal(checked_success);
}

const compilation_error = (res) => {
  const comp_error = "Compilation error.\n";
  const start = res.startsWith(comp_error);
  expect(start).to.equal(true);
}



chai.use(chaiHttp);

 /*
  * Test the /GET route
  */
 // Note: it will print the error on console
 describe('/GET type check', () => {
  it('it shouldnt type check on Segmentation fault', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({code: `
bugar  : Unit -> IO(Unit)
  (u) bugar(u)

bugar2 : Unit -> IO(Unit)
  (u) bugar(u)

App.Kaelin.App.test: bugar(Unit.new) == bugar2(Unit.new)
  refl
      `})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal(utils.log_msg.type_check_error);
        done();
      });
  });

  it('it should type check an existing term', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({code: 'type Nat {zero, succ(pred: Nat)}'})
      .end((err, res) => {
        res.should.have.status(200);
        type_check_success(res.text);
        done();
      });
  });
  it('it should fail to type check an empty term', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({code: ''})
      .end((err, res) => {
        res.should.have.status(200);
        type_check_fails(res.text);
        done();
      });
  });
  it('it should type check on a loop', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({cod: `
bugar : IO(Unit)
  bugar

App.Kaelin.App.test: IO(Unit)
  bugar
      `})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal(utils.log_msg.invalid_url);
        done();
      });
  });


  it('it should fail if req does not have the right param', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({cod: 'type A {b: Nat}'})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal(utils.log_msg.invalid_url);
        done();
      });
  });
  it('it should fail if req param is empty', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({code: ''})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal(utils.log_msg.invalid_url);
        done();
      });
  });
  
});

describe('/GET run term', () => {
  it('it should run a term', (done) => {
    chai.request(url)
      .get('/api/run_term')
      .query({code: "playground.main: Nat 5 + 10"})
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.equal("15n\n");
        done();
      });
  });
  it('it should fail to run without a "playground.main" term', (done) => {
    chai.request(url)
      .get('/api/run_term')
      .query({code: "main: Nat 5 + 10"})
      .end((err, res) => {
        res.should.have.status(200);
        compilation_error(res.text);
        done();
      });
  });

});