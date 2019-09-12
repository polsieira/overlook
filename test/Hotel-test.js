import chai from 'chai';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

import users from '../data/users'
import rooms from '../data/rooms'
import bookings from '../data/bookings'
import roomServices from '../data/roomServices'

import Hotel from '../src/Hotel.js';

describe('Hotel', () => {

  let hotel, today;
  beforeEach(() => {
    hotel = new Hotel(users, rooms, bookings, roomServices);
    today = hotel.returnTodaysDate();
  });

  it('should be a function that instantiates booking', () => {
    expect(Hotel).to.be.a('function');
    expect(hotel).to.be.an.instanceof(Hotel);
  });

  describe('should contain data for customer, rooms, bookings, room service', () => {
    it('should contain data for customers', () => {
      expect(hotel.customers).to.eql(users);
    });
    it('should contain data for customers', () => {
      expect(hotel.rooms).to.eql(rooms);
    });
    it('should contain data for customers', () => {
      expect(hotel.bookings).to.eql(bookings);
    });
    it('should contain data for customers', () => {
      expect(hotel.roomServices).to.eql(roomServices);
    });
  });

  it('should return the current date in yyyy/mm/dd format', () => {
    expect(hotel.returnTodaysDate()).to.equal(today)
  });

  it('should return the total number of rooms booked today', () => {
    expect(hotel.findRoomsBooked('2019/09/11').length).to.equal(21);
  });

  it('should return the total number of rooms booked today', () => {
    expect(hotel.findRoomServiceOrdered('2019/09/11').length).to.equal(2);
  });

  it('should return the total number of rooms avaliable today', () => {
    expect(hotel.returnTotalRoomsAvaliable('2019/09/11')).to.equal(29);
  });

  it('should return the total revenue today', () => {
    expect(hotel.returnTotalRevenue('2019/09/11')).to.equal(6676.08);
  });

  it('should return the percentage of rooms occupied today', () => {
    expect(hotel.returnPercentageOfRoomsOccupied('2019/09/11')).to.equal(42);
  });
});