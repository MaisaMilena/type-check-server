process.env.NODE_ENV = 'test';
require('dotenv').config();

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



chai.use(chaiHttp);

 /*
  * Test the /GET route
  */
 describe('/GET type check', () => {
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
  it('it should NOT type check an empty term', (done) => {
    chai.request(url)
      .get('/api/check_term')
      .query({code: ''})
      .end((err, res) => {
        res.should.have.status(200);
        type_check_fails(res.text);
        done();
      });
  });

  // it('it should fail if req does not have the right param', (done) => {
  //   chai.request(url)
  //     .get('/api/check_term')
  //     .query({code: 'type Nat {zero, succ(pred: Nat)}'})
  //     .end((err, res) => {

  //       // expect(err).to.be.null;
  //       res.should.have.status(200);
  //       // expect(res).to.have.param('code');
  //       done();
  //     });
  // });
});
