import $ from 'jquery';

export default {

  updateDate(date) {
    $('.todaysDate').text(date);
  },

  changeTab(event, _this) {
    event.preventDefault();
    $('.tabs-nav li').removeClass('tab-active');
    $(_this).parent().addClass('tab-active');
    $('.tabs-stage div').hide();
    $($(_this).attr('href')).show();
  },

  startOnMainTab() {
    $('.tabs-stage div').hide();
    $('.tabs-stage div:first').show();
    $('.tabs-nav li:first').addClass('tab-active');
  }
}