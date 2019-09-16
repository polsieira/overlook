class Booking {
  constructor(bookings) {
    this.bookings = bookings;
  }

  findPopularBookingDate() {
    let bookingByDate = this.bookings.reduce((days, booking) => {
      if (days[booking.date]) {
        days[booking.date] += 1;
      } else {
        days[booking.date] = 1;
      }

      return days;
    }, {});

    let keys = Object.keys(bookingByDate);
    let instances = Object.values(bookingByDate);
    let min = Math.min(...instances);
    let max = Math.max(...instances);

    let popularDate = keys.find(key => {
      return bookingByDate[key] === max;
    });

    let openDate = keys.find(key => {
      return bookingByDate[key] === min;
    });

    return {
      mostPopular: popularDate,
      leastPopular: openDate
    };
  }
}

export default Booking;