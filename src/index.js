import $ from 'jquery';
import 'jquery-ui-bundle';
import './css/base.scss';
import './images/logo.png'
import './images/searching-magnifying-glass.svg'
import './images/plus.svg'
import domUpdates from './domUpdates'

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';

// Fetch Data
let hotel;

let apiRequest1 = fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
  .then(data => data.json())

let apiRequest2 = fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms")
  .then(data => data.json())

let apiRequest3 = fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings")
  .then(data => data.json())

let apiRequest4 = fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices")
  .then(data => data.json())

var data = {
  "customers": {},
  "rooms": {},
  "bookings": {},
  "roomServices": {},
};

Promise.all([apiRequest1, apiRequest2, apiRequest3, apiRequest4])
  .then((values) => {
    data["customers"] = values[0].users;
    data["rooms"] = values[1].rooms;
    data["bookings"] = values[2].bookings;
    data["roomServices"] = values[3].roomServices;
    return data;
  })
  .then(() => start());

// Show the first tab by default
domUpdates.startOnMainTab();

// Change tab class and display content
$('.tabs-nav a').on('click', function (event) {
  let _this = this;
  domUpdates.changeTab(event, _this);
});

function start() {
  instantiateHotel();
  let today = hotel.returnTodaysDate();
  domUpdates.addCustomers(data.customers);
  domUpdates.updateDate();
  searchOrders(today);
  updateCalendar();
  updateMainTab(today);
}

function instantiateHotel() {
  hotel = new Hotel(data);
}

function updateCalendar() {
  $(function () {
    $("#datepicker").datepicker({
      dateFormat: "yy/mm/dd",
      showAnim: "slide",
      onSelect: (date) => searchOrders(date)
    });
  });
}

$("#datepicker").on('keyup', (event) => {
  searchOrders(event.target.value);
});

function searchOrders(date) {
  let filteredServices = hotel.roomServices.filter(service => {
    return service.date.includes(date);
  });
  domUpdates.addRoomServices(filteredServices);
}

function updateMainTab(date) {
  domUpdates.updateDOMtext('.info--rooms-avaliable',
    hotel.returnTotalRoomsAvaliable(date));
  domUpdates.updateDOMtext('.info--total-revenue',
    `$${hotel.returnTotalRevenue(date)}`);
  domUpdates.updateDOMtext('.info--percent-occupied',
    `${hotel.returnPercentageOfRoomsOccupied(date)}%`);
}

// Select customer
$('.search-results').on('click', (event) => {
  domUpdates.updateCurrentCustomer(event.target.innerText);
  hotel.getCurrentCustomer(event.target.innerText)
});

// Search functionality
$('.input--search').on('keyup', (event) => {
  let filteredCustomers = hotel.customers.filter(customer => {
    return customer.name.toUpperCase().includes(event.target.value.toUpperCase());
  });
  domUpdates.addCustomers(filteredCustomers);
});

// Add customer
$('.button--add').on('click', () => {
  let firstName = $('.first-name').val();
  let lastName = $('.last-name').val();
  let newName = `${firstName} ${lastName}`;
  let newID = hotel.customers.length + 1;
  hotel.customers.push({
    id: newID,
    name: newName
  });
  domUpdates.addCustomers(hotel.customers);
  domUpdates.clearInputs(['.first-name', '.last-name']);
  domUpdates.updateCurrentCustomer(`${lastName}, ${firstName}`);
  hotel.currentCustomer = hotel.customers.find(customer => {
    return customer.id === newID;
  })
});