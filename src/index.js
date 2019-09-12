import $ from 'jquery';
import './css/base.scss';
import './images/logo.png'
import './images/searching-magnifying-glass.svg'
import './images/plus.svg'
import domUpdates from './domUpdates'

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';

// Fetch Data

let hotel, customers, rooms, bookings, roomServices;

fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
  .then(data => data.json())
  .then(data => {
    customers = data.users;
    domUpdates.addCustomers(customers);
  })
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

// Show the first tab by default
domUpdates.startOnMainTab();

// Change tab class and display content
$('.tabs-nav a').on('click', function (event) {
  let _this = this;
  domUpdates.changeTab(event, _this);
});

// Start main script
setTimeout(() => start(), 1000)

function start() {
  instantiateHotel();
  let today = hotel.returnTodaysDate();
  domUpdates.updateDate();
  updateMainTab(today);
}

function instantiateHotel() {
  hotel = new Hotel(customers, rooms, bookings, roomServices);
}

function updateMainTab(date) {
  domUpdates.updateDOMtext('.info--rooms-avaliable',
    hotel.returnTotalRoomsAvaliable(date));
  domUpdates.updateDOMtext('.info--total-revenue',
    `$${hotel.returnTotalRevenue(date)}`);
  domUpdates.updateDOMtext('.info--percent-occupied',
    `${hotel.returnPercentageOfRoomsOccupied(date)}%`);
}

$('.customer-name').on('click', function (event) {
  let _this = this;
  console.log(_this);
});

$('.input--search').on('keyup', (event) => {
  let filteredCustomers = customers.filter(customer => {
    return customer.name.toUpperCase().includes(event.target.value.toUpperCase());
  });
  domUpdates.addCustomers(filteredCustomers);
});