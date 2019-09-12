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
  }
}