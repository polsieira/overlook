class Hotel {
  constructor(customers, rooms, bookings, roomServices) {
    this.customers = customers;
    this.rooms = rooms;
    this.bookings = bookings;
    this.roomServices = roomServices;
  }

  getDate() {
    let today = new Date(Date.now());
    return today;
  }

  totalRoomsAvaliableToday() {

  }

  totalRevenueToday() {

  }

  percentageOfRoomsOccupiedToday() {

  }
}

export default Hotel;