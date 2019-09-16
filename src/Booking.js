class Booking {
  constructor(bookings, rooms) {
    this.bookings = bookings;
    this.rooms = rooms;
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

  findBookedRooms(date) {
    let bookedRooms = [];
    this.bookings.forEach(booking => {
      if (booking.date === date) {
        bookedRooms.push(booking.roomNumber);
      }
    });

    return bookedRooms;
  }

  findAvaliableRooms(date) {
    let bookedRooms = this.findBookedRooms(date);
    return this.rooms.reduce((avaliableRooms, room) => {
      if (!bookedRooms.includes(room.number)) {
        avaliableRooms.push(room);
      }

      return avaliableRooms;
    }, []);
  }

  filterByRoomType(rooms, type) {
    return rooms.filter(room => {
      return room.roomType.includes(type);
    })
  }
}

export default Booking;