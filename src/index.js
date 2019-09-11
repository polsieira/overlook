import $ from 'jquery';
import './css/base.scss';
import './images/logo.png'
import domUpdates from './domUpdates'

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';

// Fetch Data

let hotel, customers, rooms, bookings, roomServices;

fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
  .then(data => data.json())
  .then(data => customers = data.users)
  .catch(err => console.log('Unable to fetch data', err));

fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms")
  .then(data => data.json())
  .then(data => rooms = data.rooms)
  .catch(err => console.log('Unable to fetch data', err));

fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings")
  .then(data => data.json())
  .then(data => bookings = data.bookings)
  .catch(err => console.log('Unable to fetch data', err));

fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices")
  .then(data => data.json())
  .then(data => roomServices = data.roomServices)
  .catch(err => console.log('Unable to fetch data', err));

setTimeout(() => start(), 300)

function start() {
  instantiateHotel();
  // Update todays date
  domUpdates.updateDate(hotel.getDate())
}

function instantiateHotel() {
  hotel = new Hotel(customers, rooms, bookings, roomServices);
}

// Show the first tab by default
domUpdates.startOnMainTab()

// Change tab class and display content
$('.tabs-nav a').on('click', function (event) {
  let _this = this;
  domUpdates.changeTab(event, _this);
});