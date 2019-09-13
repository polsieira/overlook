class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.name = customer.name;
  }

  getCustomerSpecificData(data) {
    return data.filter(each => each.userID === this.id);
  }

  calculateTotalBill(bills) {
    return bills.reduce((total, bill) => {
      total += bill.totalCost;
      return total;
    }, 0);
  }

  calculateDailyBill(bills, date) {
    let billsByDate = bills.filter(bill => bill.date === date);
    return billsByDate.reduce((total, bill) => {
      total += bill.totalCost;
      return total;
    }, 0);
  }

}

export default Customer;