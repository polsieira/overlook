import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import Hotel from '../src/Hotel.js';

describe('Hotel', () => {

  let hotel;
  beforeEach(() => {
    hotel = new Hotel();
  });

  it('should be a function that instantiates booking', () => {
    expect(Hotel).to.be.a('function');
    expect(hotel).to.be.an.instanceof(Hotel);
  });
});