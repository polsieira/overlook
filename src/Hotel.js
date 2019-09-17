class Hotel {
  constructor(data) {
    this.customers = data.customers;
    this.rooms = data.rooms;
    this.bookings = data.bookings;
    this.roomServices = data.roomServices;
    this.currentCustomer = null;
  }

  returnTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = `${yyyy}/${mm}/${dd}`;
    return today;
  }

  getCurrentCustomer(id) {
    this.currentCustomer = this.customers.find(customer => {
      return customer.id === parseInt(id);
    });
  }

  findRoomsBooked(date) {
    return this.bookings.filter(booking => {
      return booking.date === date;
    });
  }

  findRoomServiceOrdered(date) {
    return this.roomServices.filter(roomService => {
      return roomService.date === date;
    });
  }

  returnTotalRoomsAvaliable(date) {
    return this.rooms.length - this.findRoomsBooked(date).length;
  }

  returnTotalRevenue(date) {
    let bookedRooms = this.findRoomsBooked(date);
    let roomRevenue = bookedRooms.reduce((revenue, bookedRoom) => {
      let costPerRoom = this.rooms.find(room => {
        return room.number === bookedRoom.roomNumber;
      }).costPerNight;
      revenue += costPerRoom;
      return revenue;
    }, 0);
    let roomServices = this.findRoomServiceOrdered(date);
    let roomServiceRevenue = roomServices.reduce((revenue, roomService) => {
      revenue += roomService.totalCost;
      return revenue;
    }, 0)
    let revenue = roomRevenue + roomServiceRevenue;
    return parseFloat(revenue.toFixed(2));
  }

  returnPercentageOfRoomsOccupied(date) {
    return this.findRoomsBooked(date).length / this.rooms.length * 100;
  }
}

export default Hotel;