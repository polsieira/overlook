import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import users from '../data/users'
import rooms from '../data/rooms'
import bookings from '../data/bookings'
import roomServices from '../data/roomServices'

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

  it('should be able to get customer specific data', () => {
    expect(customer.getCustomerSpecificData(roomServices)).to.eql([{
      userID: 1,
      date: '2019/09/28',
      food: 'Refined Rubber Sandwich',
      totalCost: 9.89
    }])
  });

  it('should calculate a specific customers total bill', () => {
    let bills = customer.getCustomerSpecificData(roomServices);
    expect(customer.calculateTotalBill(bills)).to.equal(9.89);
  });

  it('should calculate a specific customers total bill for todays date', () => {
    let bills = customer.getCustomerSpecificData(roomServices);
    expect(customer.calculateDailyBill(bills, '2019/09/27')).to.equal(0);
    expect(customer.calculateDailyBill(bills, '2019/09/28')).to.equal(9.89);
  });

});