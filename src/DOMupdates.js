import $ from 'jquery';

export default {

  updateDate() {
    let date = new Date(Date.now())
    $('.todays-date').text(date);
  },

  updateCurrentCustomer(customerName) {
    $('.current-customer').html(`<p>Guest: ${customerName}</p><img src="./images/delete-button.svg" class="img-delete-current-customer" alt="delete button">`);
  },

  updateDOMhtml(location, content) {
    $(location).html(content);
  },

  updateDOMtext(location, content) {
    $(location).text(content);
  },

  clearInputs(inputs) {
    inputs.forEach(input => {
      $(input).val('');
    });
  },

  changeTab(event, _this) {
    event.preventDefault();
    $('.tabs-nav li').removeClass('tab-active');
    $(_this).parent().addClass('tab-active');
    $('.tabs-stage section').hide();
    $($(_this).attr('href')).show();
  },

  startOnMainTab() {
    $('.tabs-stage section').hide();
    $('.tabs-stage section:first').show();
    $('.tabs-nav li:first').addClass('tab-active');
  },

  addCustomers(customers) {
    let html = '';
    if (customers.length < 1) {
      html += `<span class="no-search-results">No customers found...</span>`
    } else {
      customers.sort((customerA, customerB) => {
        if (customerA.name.split(' ').pop()[0] > customerB.name.split(' ').pop()[0]) {
          return 1;
        } else if (customerA.name.split(' ').pop()[0] < customerB.name.split(' ').pop()[0]) {
          return -1;
        }
        return 0;
      });
      customers.forEach(customer => {
        html += `<span class="customer-name">${customer.name.split(' ')[1]}, ${customer.name.split(' ')[0]}</span>`
      });
    }
    $('.search-results').html(html);
  },

  addBookings(bookings, day) {
    let html = '';
    if (!day) {
      day = ''
    }
    if (bookings.length < 1) {
      html += `<span class="no-search-results">No bookings found...</span>`
    } else {
      html += `<table>
    <thead>
    <tr>
      <th>Room Number</th>
      <th>Room Type</th>
      <th>Bidet</th>
      <th>Bed Size</th>
      <th>Number of Beds</th>
      <th>Cost Per Night</th>
    </tr>
    </thead>
    <tbody>`
      bookings.forEach(booking => {
        html += `<tr>
          <td>
            ${booking.number}
          </td>
          <td>
            ${booking.roomType}
          </td>
          <td>
            ${booking.bidet}
          </td>
          <td>
            ${booking.bedSize}
          </td>
          <td>
            ${booking.numBeds}
          </td>
          <td>
            $${booking.costPerNight}
          </td>
        </tr>`
      });
    }
    html += `</tbody></table>`;
    $('.avaliable-rooms').html(html);
    $('#datepicker-rooms').val(`${day}`)
  },

  addCustomerBookings(bookings) {
    let html = '';
    if (bookings.length < 1) {
      html += `<span class="no-search-results">No bookings found...</span>`
    } else {
      bookings.sort((orderA, orderB) => {
        let A = orderA.date.split('/').join();
        let B = orderB.date.split('/').join();
        return B > A ? 1 : B < A ? -1 : 0;
      });
      bookings.forEach(booking => {
        html += `<span class="order">
        <div>
          ${booking.date}
        </div>
        <div>Room Number:   
          ${booking.roomNumber}
        </div>
        </span>`
      });
    }
    $('.customer-bookings').html(html);
  },

  addRoomServices(roomServices, day) {
    let html = '';
    if (!day) {
      day = ''
    }
    if (roomServices.length < 1) {
      html += `<span class="no-search-results">No orders found...</span>`
    } else {
      roomServices.sort((orderA, orderB) => {
        let A = orderA.date.split('/').join();
        let B = orderB.date.split('/').join();
        return B > A ? 1 : B < A ? -1 : 0;
      });
      roomServices.forEach(order => {
        html += `<span class="order">
        <div>${order.date}</div>
        <div>Guest Number: ${order.userID}</div>
        <div>${order.food}</div>
        <div>$${order.totalCost}</div>
        </span>`
      });
    }
    $('.order-results').html(html);
    $('#datepicker-orders').val(`${day}`)
  },

  addCustomerSpending(totalSpent, dailySpent) {
    $('.total-spent').text(`Total Spent: $${totalSpent}`);
    $('.spent-today').text(`Total Spent Today: $${dailySpent}`);
  },

  toggleButton(button, toggle) {
    $(button).attr("disabled", toggle);
  }


}