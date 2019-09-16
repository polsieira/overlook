import $ from 'jquery';
import 'jquery-ui-bundle';
import './css/base.scss';
import './images/logo.png'
import './images/searching-magnifying-glass.svg'
import './images/plus.svg'
import './images/delete-button.svg'
import domUpdates from './domUpdates'

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';

// Globals
let hotel, booking, customer, today;

// Fetch Data
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
  instantiateBooking();
  today = hotel.returnTodaysDate();
  domUpdates.addCustomers(data.customers);
  domUpdates.addBookings(booking.findAvaliableRooms(today), today);
  domUpdates.updateDate();
  updateOrders(today);
  updateCalendar();
  updateMainTab(today);
  updateRoomTab();
}

function instantiateHotel() {
  hotel = new Hotel(data);
}

function instantiateBooking() {
  booking = new Booking(data.bookings, data.rooms);
}

function instantiateCustomer(customerData) {
  customer = new Customer(customerData);
}

function updateCalendar() {
  $(function () {
    $("#datepicker-orders").datepicker({
      dateFormat: "yy/mm/dd",
      showAnim: "slide",
      onSelect: (date) => updateOrders(date)
    });
  });
  $(function () {
    $("#datepicker-rooms").datepicker({
      dateFormat: "yy/mm/dd",
      showAnim: "slide",
      onSelect: (date) => updateRooms(date)
    });
  });
}

$("#datepicker-orders").on('keyup', (event) => {
  updateOrders(event.target.value);
});

$("#datepicker-orders").on('keyup', (event) => {
  updateRooms(event.target.value);
});

function updateOrders(date) {
  let filteredServices = hotel.roomServices.filter(service => {
    return service.date.includes(date);
  });
  domUpdates.addRoomServices(filteredServices, date);
}

function updateRooms(date) {
  domUpdates.addBookings(booking.findAvaliableRooms(date), date);
}

function updateMainTab(date) {
  domUpdates.updateDOMtext('.info--rooms-avaliable',
    hotel.returnTotalRoomsAvaliable(date));
  domUpdates.updateDOMtext('.info--total-revenue',
    `$${hotel.returnTotalRevenue(date)}`);
  domUpdates.updateDOMtext('.info--percent-occupied',
    `${hotel.returnPercentageOfRoomsOccupied(date)}%`);
}

function updateRoomTab() {
  let dates = booking.findPopularBookingDate();
  domUpdates.updateDOMtext('.popular-booking-date', `Most Booked Day: ${dates.mostPopular}`);
  domUpdates.updateDOMtext('.most-rooms-avaliable-date', `Day With Most Avaliability: ${dates.leastPopular}`);
}

// Select customer
$('.search-results').on('click', (event) => {
  domUpdates.updateCurrentCustomer(event.target.innerText);
  hotel.getCurrentCustomer(event.target.innerText);
  instantiateCustomer(hotel.currentCustomer);
  let bills = customer.getCustomerSpecificData(hotel.roomServices);
  domUpdates
    .addCustomerSpending((customer
      .calculateTotalBill(bills)).toFixed(2), (customer
      .calculateDailyBill(bills, today)).toFixed(2));
  domUpdates.addRoomServices(bills);
  let bookings = customer.getCustomerSpecificData(hotel.bookings)
  domUpdates.addCustomerBookings(bookings);
  if (!customer.determineBookingToday(bookings, today)) {
    domUpdates.toggleButton('.button--new-booking', false);
  } else {
    domUpdates.toggleButton('.button--new-booking', true);
  }
});

//Delete customer
$('.current-customer').on('click', () => {
  if (event.target.classList[0] === 'img-delete-current-customer') {
    domUpdates.updateDOMhtml('.current-customer', '');
  }
  hotel.currentCustomer = null;
  domUpdates.updateDOMhtml('.total-spent', '');
  domUpdates.updateDOMhtml('.spent-today', '')
  domUpdates.addRoomServices(hotel.roomServices);
  domUpdates.toggleButton('.button--new-booking', true);
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
  hotel.getCurrentCustomer(`${lastName}, ${firstName}`);
  instantiateCustomer(hotel.currentCustomer);
  let bills = customer.getCustomerSpecificData(hotel.roomServices);
  domUpdates
    .addCustomerSpending((customer
      .calculateTotalBill(bills)).toFixed(2), (customer
      .calculateDailyBill(bills, today)).toFixed(2));
  domUpdates.addRoomServices(bills);
  let bookings = customer.getCustomerSpecificData(hotel.bookings)
  domUpdates.addCustomerBookings(bookings);
  if (!customer.determineBookingToday(bookings, today)) {
    domUpdates.toggleButton('.button--new-booking', false);
  }
});