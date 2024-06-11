// api/models/customerModel.js

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  byUser: { type: Number, required: true },
    cusName: { type: String, required: true },
    addhar: { type: String, required: true },
    addCus: { type: String, required: true },
    bookingAmount: { type: String, required: true },
    executive: { type: String, required: true },
    hp: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
  
  logs: [
    {
      timestamp: {
        type: Date,
        default: Date.now(),
      },
      userRole: { type: String, required: true },
      message: String,
    },
  ],
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
