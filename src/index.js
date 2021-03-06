import $ from 'jquery';
import 'jquery-ui-bundle';
import './sorttable';

import './css/base.scss';

import './images/logo.png'
import './images/searching-magnifying-glass.svg'
import './images/plus.svg'
import './images/delete-button.svg'

import domUpdates from './domUpdates'

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';
import {
  WSA_E_NO_MORE
} from 'constants';

// Globals
let hotel, booking, customer, today;

// Fetch Data
let apiRequest1 = fetch(
  "https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users")
  .then(data => data.json())

let apiRequest2 = fetch(
  "https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms")
  .then(data => data.json())

let apiRequest3 = fetch(
  "https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings")
  .then(data => data.json())

let apiRequest4 = fetch(
  "https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices")
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
  domUpdates.buildRoomServiceMenu(createRoomServiceMenu());
}

// Show the first tab by default
domUpdates.startOnMainTab();

// Change tab class and display content
$('.tabs-nav a').on('click', function (event) {
  let _this = this;
  domUpdates.changeTab(event, _this);
});

function instantiateHotel() {
  hotel = new Hotel(data);
}

function instantiateBooking() {
  booking = new Booking(data.bookings, data.rooms);
}

function instantiateCustomer(customerData) {
  customer = new Customer(customerData);
}


// Event listeners
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
  hotel.getCurrentCustomer(event.target.dataset.id);
  instantiateCustomer(hotel.currentCustomer);
  let bills = customer.getCustomerSpecificData(hotel.roomServices);
  domUpdates
    .addCustomerSpending(
      (customer.calculateTotalBill(bills)).toFixed(2),
      (customer.calculateDailyBill(bills, today)).toFixed(2));
  domUpdates.addRoomServices(bills);
  let bookings = customer.getCustomerSpecificData(hotel.bookings)
  domUpdates.addCustomerBookings(bookings);
  if (!customer.determineBookingToday(bookings, today)) {
    domUpdates.toggleButton('.button--new-booking', false);
    domUpdates.toggleButton('.button--order-room-service', true);
  } else {
    domUpdates.toggleButton('.button--new-booking', true);
    domUpdates.toggleButton('.button--order-room-service', false);
  }
  domUpdates.toggleRoomServiceMenu(false);
  domUpdates.toggleRoomTypeMenu(false);
});

//Delete customer
$('.current-customer').on('click', () => {
  if (event.target.classList[0] === 'img-delete-current-customer') {
    domUpdates.updateDOMhtml('.current-customer', '');
  }
  hotel.currentCustomer = null;
  domUpdates.updateDOMhtml('.total-spent', '');
  domUpdates.updateDOMhtml('.spent-today', '');
  domUpdates.updateDOMhtml('.customer-bookings', '');
  domUpdates.addRoomServices(hotel.roomServices);
  domUpdates.toggleButton('.button--new-booking', true);
  domUpdates.toggleButton('.button--order-room-service', true);
  domUpdates.toggleRoomServiceMenu(false);
  domUpdates.toggleRoomTypeMenu(false);
});

// Search functionality
$('.input--search').on('keyup', (event) => {
  let filteredCustomers = hotel.customers.filter(customer => {
    return customer.name.toUpperCase()
      .includes(event.target.value.toUpperCase());
  });
  domUpdates.addCustomers(filteredCustomers);
});

// Enable add customer button
$('.first-name').on('keyup', () => {
  let firstName = $('.first-name').val();
  let lastName = $('.last-name').val();
  if (firstName !== '' && lastName !== '') {
    domUpdates.toggleButton('.button--add', false);
  } else {
    domUpdates.toggleButton('.button--add', true);
  }
});

$('.last-name').on('keyup', () => {
  let firstName = $('.first-name').val();
  let lastName = $('.last-name').val();
  if (firstName !== '' && lastName !== '') {
    domUpdates.toggleButton('.button--add', false);
  } else {
    domUpdates.toggleButton('.button--add', true);
  }
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
  hotel.getCurrentCustomer(newID);
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
  domUpdates.toggleRoomServiceMenu(false);
  domUpdates.toggleRoomTypeMenu(false);
});

//New booking
$('.button--new-booking').on('click', () => {
  domUpdates.toggleButton('.button--new-booking', true);
  domUpdates.toggleRoomTypeMenu(true);
});

//Show booking type
$('.booking-container').on('change', () => {
  if (event.target.classList[0] === 'room-type') {
    let avaliableRooms = booking.findAvaliableRooms(today);
    let roomByType = booking.filterByRoomType(avaliableRooms, event.target.value);
    if (roomByType) {
      domUpdates.addBookings(roomByType, today);
    } else {
      domUpdates.addBookings(avaliableRooms, today);
    }
    domUpdates.enableSelectRoom();
    domUpdates.toggleButton('.button--reserve-booking', true);
  }
});

function createRoomServiceMenu() {
  let menu = hotel.roomServices.reduce((menu, service) => {
    if (!menu[service.food]) {
      menu[service.food] = service.totalCost;
    }
    return menu;
  }, {});

  return menu;
}

$('.button--order-room-service').on('click', () => {
  domUpdates.toggleRoomServiceMenu(true);
  domUpdates.toggleButton('.button--order-room-service', true);

});

$('.avaliable-rooms').on('click', (event) => {
  if (event.target.parentElement.className.includes('enable-pointer')) {
    domUpdates.selectRoom(event.target.parentElement);
  }
});

$('.button--reserve-booking').on('click', () => {
  let reservedRooms = $('.select-room');

  var roomNumbers = []
  for (let i = 0; i < reservedRooms.length; i++) {
    roomNumbers.push(parseInt(reservedRooms[i].dataset.roomNumber));
  }

  roomNumbers.forEach(room => {
    hotel.bookings.push({
      userID: customer.id,
      date: today,
      roomNumber: room
    });
    let bookings = customer.getCustomerSpecificData(hotel.bookings);
    domUpdates.addCustomerBookings(bookings);

    updateRooms(today);

    domUpdates.toggleButton('.button--reserve-booking', true);
    domUpdates.toggleRoomTypeMenu(false)
    domUpdates.toggleButton('.button--new-booking', true);
    domUpdates.toggleButton('.button--order-room-service', false);
    updateMainTab(today);
    $('.room-type').prop('selectedIndex', 0);
    $('.room-service').prop('selectedIndex', 0);
  })
})

// Order room service
$('.booking-container').on('change', () => {
  if (event.target.classList[0] === 'room-service') {
    hotel.roomServices.push({
      userID: customer.id,
      date: today,
      food: event.target.value.split(',')[0],
      totalCost: parseInt(event.target.value.split(',')[1])
    })
  }
  $('.room-service').prop('selectedIndex', 0);
  let filteredServices = hotel.roomServices.filter(service => {
    return service.date.includes(today) && service.userID === customer.id;
  });

  domUpdates.addRoomServices(filteredServices, today);
  domUpdates.toggleRoomServiceMenu(false);
  domUpdates.toggleButton('.button--order-room-service', false);
  let bills = customer.getCustomerSpecificData(hotel.roomServices);
  domUpdates
    .addCustomerSpending(
      (customer.calculateTotalBill(bills)).toFixed(2),
      (customer.calculateDailyBill(bills, today)).toFixed(2));
});