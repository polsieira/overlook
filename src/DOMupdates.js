import $ from 'jquery';

export default {

  updateDate() {
    let date = new Date(Date.now())
    $('.todays-date').text(date);
  },

  updateCurrentCustomer(customerName) {
    $('.current-customer').text(`Guest: ${customerName}`);
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

  addRoomServices(roomServices) {
    let html = '';
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
  }
}