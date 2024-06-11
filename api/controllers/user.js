// api/controller/user.js

const Ticket = require("../models/ticketModel");
const Customer = require("../models/customerModel");
const { v4: uuidv4 } = require("uuid");

const fetchTickets = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id !== req.userId) {
            return res.sendStatus(403);
        }

        // Fetch all users tickets from the database
        const tickets = await Ticket.find();
        res.json({ status: 200, tickets });
    } catch (error) {
        res.json({ status: "error", error: "Failed to fetch tickets" });
    }
};

const createTicket = async (req, res) => {
  try {
    const { user_id } = req.params;
    const newId = uuidv4();

    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }
    const {
      //req.params was not working for some reason, so using the user_id received from frontend
      colour,
	  model,
	  engineNo,
	  chassisNo,
      resolved,
        priority,
      location,
        assignedEngineer,
    } = req.body;

    // Create a new ticket document
    const ticket = new Ticket({
      id: newId,
      byUser: user_id,
      colour,
	  model,
	  engineNo,
	  chassisNo,
      resolved,
        priority,
      location,
        assignedEngineer,
    });
    // Save the ticket to the database
    await ticket.save();

    res.json({ status: 200 });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Failed to create ticket" });
  }
};



const BookingStock = async (req, res) => {
    try {
        const { user_id } = req.params;
        const newId = uuidv4();

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden if user ID doesn't match
        }
        const {
            //req.params was not working for some reason, so using the user_id received from frontend
            cusName,
            addCus,
            addhar,
            executive,
            hp,
            createdOn,
            bookingAmount,
        } = req.body;

        // Create a new ticket document
        const customer = new Customer({
            id: newId,
            byUser: user_id,
            cusName,
            addCus,
            addhar,
            executive,
            hp,
            createdOn,
            bookingAmount,
        });
        // Save the ticket to the database
        await customer.save();

        res.json({ status: 200 });
    } catch (error) {
        res.status(500).json({ status: "error", error: "Failed to create ticket" });
    }
};





const updateTicket = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }

    const {
      bookingAmount,
      companyName,
      email,
      phoneNumber,
      landlineNumber,
	  department,
      issue,
      classification,
      channel,
      remarks,
      resolved,
      priority,
        assignedEngineer,
        nameCus,
        executive,
        hp,
        createdOn,
      ticket_id,
    } = req.body;

    // Assuming Ticket is your Mongoose model
    const existingTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id }, // Assuming 'byUser' is the unique identifier for a ticket
      {
        bookingAmount,
        companyName,
        email,
        phoneNumber,
        landlineNumber,
		department,
        issue,
        classification,
        channel,
        remarks,
        resolved,
        priority,
          assignedEngineer,
          nameCus,
          executive,
          hp,
          createdOn,
      },
      { new: true } // Return the updated document
    );

    if (!existingTicket) {
      return res
        .status(404)
        .json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Failed to update ticket" });
  }
};






const saleLetter = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden if user ID doesn't match
        }

        const {
            deliveryAmount,
            companyName,
            email,
            phoneNumber,
            landlineNumber,
            department,
            issue,
            classification,
            channel,
            remarks,
            resolved,
            priority,
            assignedEngineer,
            nameCus,
            executive,
            hp,
            createdOn,
            ticket_id,
            issueFinance,
            issueAmount,
            approvedDate,
        } = req.body;

        // Assuming Ticket is your Mongoose model
        const existingTicket = await Ticket.findOneAndUpdate(
            { id: ticket_id }, // Assuming 'byUser' is the unique identifier for a ticket
            {
                deliveryAmount,
                companyName,
                email,
                phoneNumber,
                landlineNumber,
                department,
                issue,
                classification,
                channel,
                remarks,
                resolved,
                priority,
                assignedEngineer,
                nameCus,
                executive,
                hp,
                createdOn,
                issueFinance,
                issueAmount,
                approvedDate,
            },
            { new: true } // Return the updated document
        );

        if (!existingTicket) {
            return res
                .status(404)
                .json({ status: "error", error: "Ticket not found" });
        }

        res.json({ status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: "Failed to update ticket" });
    }
};




const deliveryTicket = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden if user ID doesn't match
        }

        const {
            deliveryAmount,
            gatePass,
            companyName,
            email,
            phoneNumber,
            landlineNumber,
            department,
            issue,
            classification,
            channel,
            remarks,
            resolved,
            priority,
            assignedEngineer,
            ticket_id,
        } = req.body;

        // Assuming Ticket is your Mongoose model
        const existingTicket = await Ticket.findOneAndUpdate(
            { id: ticket_id }, // Assuming 'byUser' is the unique identifier for a ticket
            {
                deliveryAmount,
                gatePass,
                companyName,
                email,
                phoneNumber,
                landlineNumber,
                department,
                issue,
                classification,
                channel,
                remarks,
                resolved,
                priority,
                assignedEngineer,
            },
            { new: true } // Return the updated document
        );

        if (!existingTicket) {
            return res
                .status(404)
                .json({ status: "error", error: "Ticket not found" });
        }

        res.json({ status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: "Failed to update ticket" });
    }
};



const datePassing = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id !== req.userId) {
            return res.sendStatus(403); // Forbidden if user ID doesn't match
        }

        const {
            deliveryAmount,
            companyName,
            email,
            phoneNumber,
            landlineNumber,
            department,
            issue,
            classification,
            channel,
            remarks,
            resolved,
            priority,
            assignedEngineer,
            nameCus,
            executive,
            hp,
            createdOn,
            ticket_id,
            issueFinance,
            issueAmount,
            vehicleNumber,
        } = req.body;

        // Assuming Ticket is your Mongoose model
        const existingTicket = await Ticket.findOneAndUpdate(
            { id: ticket_id }, // Assuming 'byUser' is the unique identifier for a ticket
            {
                deliveryAmount,
                companyName,
                email,
                phoneNumber,
                landlineNumber,
                department,
                issue,
                classification,
                channel,
                remarks,
                resolved,
                priority,
                assignedEngineer,
                nameCus,
                executive,
                hp,
                createdOn,
                issueFinance,
                issueAmount,
                vehicleNumber,
            },
            { new: true } // Return the updated document
        );

        if (!existingTicket) {
            return res
                .status(404)
                .json({ status: "error", error: "Ticket not found" });
        }

        res.json({ status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: "Failed to update ticket" });
    }
};




const createBulkTickets = async (req, res) => {
    const { user_id } = req.params;
    const newId = uuidv4();
  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }
    try {
        
        const tickets = req.body.map(ticket => ({
            id: uuidv4(),
            colour: ticket.colour,
            model: ticket.model,
            engineNo: ticket.engineNo,
            chassisNo: ticket.chassisNo,
            location: ticket.location,
            assignedEngineer: ticket.assignedEngineer,
            byUser: user_id  
        }));

        await Ticket.insertMany(tickets); 
        res.json({ status: 200, message: 'Bulk tickets have been successfully created.' });
    } catch (error) {
        console.error("Error creating bulk tickets:", error);
        res.status(500).json({ status: "error", error: "Failed to create bulk tickets: " + error.message });
    }
};



const fetchSingleTicket = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const ticket = await Ticket.findOne({ id: ticket_id });
    res.json({ status: 200, ticket });
  } catch (err) {
    console.log(err);
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const filter = { id: ticket_id };
    const update = { resolved: req.body.resolved };
    const doc = await Ticket.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.json({ status: 200 });
  } catch (err) {
    console.log(err);
  }
};

const addMessage = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { userRole, textMessage } = req.body;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    {
      $push: {
        logs: {
          timestamp: Date.now(),
          userRole: userRole,
          message: textMessage,
        },
      },
    },
    { new: true } // This option returns the updated ticket after the update
  );
  // console.log(ticket.logs);
  res.json({ status: 200 });
};

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch customers', error });
    }
};



module.exports = {
  fetchTickets,
    createTicket,
    updateTicket,
    BookingStock,
  createBulkTickets,
  fetchSingleTicket,
  updateTicketStatus,
    addMessage,
    deliveryTicket,
    getCustomers,
    saleLetter,
    datePassing,
};
