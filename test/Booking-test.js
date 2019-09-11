import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import Booking from '../src/Hotel.js';

describe('Booking', () => {

  let booking;
  beforeEach(() => {
    booking = new Booking();
  });

  it('should be a function that instantiates booking', () => {
    expect(Booking).to.be.a('function');
    expect(booking).to.be.an.instanceof(Booking);
  });
});