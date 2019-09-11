import $ from 'jquery';
import './css/base.scss';

import Hotel from '../src/Hotel.js';
import Customer from '../src/Customer.js';
import Booking from '../src/Booking.js';

// Fetch Data
function getUsers() {
  const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users";
  const promise = fetch(url)
    .then(users => users.json())
    .catch(err => console.log(err));

  return promise;
}

console.log(getUsers())

function getRooms() {
  const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/rooms/rooms";
  const promise = fetch(url)
    .then(rooms => rooms.json())
    .catch(err => console.log(err));

  return promise;
}

function getBookings() {
  const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/bookings/bookings";
  const promise = fetch(url)
    .then(bookings => bookings.json())
    .catch(err => console.log(err));

  return promise;
}

function getRoomServices() {
  const url = "https://fe-apps.herokuapp.com/api/v1/overlook/1904/room-services/roomServices";
  const promise = fetch(url)
    .then(roomServices => roomServices.json())
    .catch(err => console.log(err));

  return promise;
}