// api/route/user.js

const express = require("express");
const {
  fetchTickets,
    createTicket,
    updateTicket,
    deliveryTicket,
    BookingStock,
  createBulkTickets,
  fetchSingleTicket,
  updateTicketStatus,
    addMessage,
    getCustomers,
    saleLetter,
    datePassing,
} = require("../controllers/user.js");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.get("/:user_id/tickets", authenticateToken, fetchTickets);
router.post("/:user_id/createticket", authenticateToken, createTicket);
router.post("/:user_id/bookingstock", authenticateToken, BookingStock);
router.patch("/:user_id/updateticket", authenticateToken, updateTicket);
router.get('/:user_id/customers', getCustomers);
router.patch("/:user_id/deliveryticket", authenticateToken, deliveryTicket);
router.patch("/:user_id/saleletter", authenticateToken, saleLetter);
router.patch("/:user_id/datepassing", authenticateToken, datePassing);
router.post("/:user_id/bulkcreateticket", authenticateToken, createBulkTickets);
router.get("/:user_id/ticket/:ticket_id", authenticateToken, fetchSingleTicket);
router.put(
  "/:user_id/ticket/:ticket_id/update",
  authenticateToken,
  updateTicketStatus
);
router.put(
  "/:user_id/ticket/:ticket_id/add_message",
  authenticateToken,
  addMessage
);

module.exports = router;
