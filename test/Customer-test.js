import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);
import Customer from '../src/Hotel.js';

describe('Customer', () => {

  let customer;
  beforeEach(() => {
    customer = new Customer();
  });

  it('should be a function that instantiates booking', () => {
    expect(Customer).to.be.a('function');
    expect(customer).to.be.an.instanceof(Customer);
  });
});