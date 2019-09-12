import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import Customer from '../src/Customer.js';

describe('Customer', () => {

  let customer;
  beforeEach(() => {
    customer = new Customer({
      id: 1,
      name: "Matilde Larson"
    });
  });

  it('should be a function that instantiates booking', () => {
    expect(Customer).to.be.a('function');
    expect(customer).to.be.an.instanceof(Customer);
  });

  describe('should have properties of id and name', () => {

    it('should have an id', () => {
      expect(customer.id).to.equal(1)
    });

    it('should have a name', () => {
      expect(customer.name).to.equal("Matilde Larson")
    });

  });

});