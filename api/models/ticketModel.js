const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  byUser: { type: Number, required: true },
  colour: { type: String, required: true },
    model: { type: String, required: true },
    deliveryAmount: { type: String },
    gatePass: { type: String },
    engineNo: { type: String, required: true , unique: true },
    location: { type: String, required: true },
    chassisNo: { type: String, required: true, unique: true },
    assignedEngineer: String,
    nameCus: String,
    executive: String,
    hp: String,
    createdAt: { type: Date, default: Date.now },
    createdOn: { type: Date},
    issueFinance: String,
    issueAmount: String,
    bookingAmount: String,
    vehicleNumber: String,
    approvedDate: { type: Date},
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

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
