import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import bookings from '../data/bookings'
import rooms from '../data/rooms'


import Booking from '../src/Booking.js';


describe('Booking', () => {

  let booking;
  beforeEach(() => {
    booking = new Booking(bookings, rooms);
  });

  it('should be a function that instantiates booking', () => {
    expect(Booking).to.be.a('function');
    expect(booking).to.be.an.instanceof(Booking);
  });

  describe('Booking properties', () => {

    it('should contain data on bookings', () => {
      expect(booking.bookings).to.eql(bookings);
    });
  });

  it('should be able to calculate the most popular booking date', () => {
    expect(booking.findPopularBookingDate().mostPopular).to.equal('2019/10/28');
  });

  it('should return the most avaliable date', () => {
    expect(booking.findPopularBookingDate().leastPopular).to.equal('2019/07/23');
  });

  it('should return all booked rooms for a spcified date', () => {
    expect(booking.findBookedRooms('2019/10/19')).to.eql([
      5, 16, 40,
      25, 19, 15,
      6, 26, 10,
      13, 28, 37
    ])
  });

  it('should return all avaliable rooms for a spcified date', () => {
    expect(booking.findAvaliableRooms('2019/10/19').length).to.eql(38)
  });

});