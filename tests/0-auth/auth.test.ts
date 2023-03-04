import chai from 'chai';
import chaiHttp from 'chai-http';

chai.should();
chai.use(chaiHttp);

describe('Currency Rates', () => {
  describe('GET /currency/rates', () => {
    it('It should get currency rates for today', (done) => {
      chai
        .request(`http://localhost:4200`)
        .get(`/curreny-conversion/api/v1/currency/rates`)
        .end((err, response) => {
          response.body.should.have.property('message').to.equal('success');
          done();
        });
    });
  });
});
