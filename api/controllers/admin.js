const Ticket = require("../models/ticketModel");
const UserData = require("../models/userModel");
const XLSX = require('xlsx');

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

const exportTickets = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (user_id !== req.userId) {
            return res.sendStatus(403);
        }

        const durations = ["day", "month", "year"];
        const workbook = XLSX.utils.book_new();

        for (const duration of durations) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let start, end;
            if (duration === "day") {
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                start = today;
                end = tomorrow;
            } else if (duration === "month") {
                const startOfMonth = new Date(today);
                startOfMonth.setDate(1);
                const nextMonth = new Date(today);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                start = startOfMonth;
                end = nextMonth;
            } else if (duration === "year") {
                const startOfYear = new Date(today);
                startOfYear.setMonth(0, 1);
                const nextYear = new Date(today);
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                start = startOfYear;
                end = nextYear;
            }

            const tickets = await Ticket.find({
                createdAt: { $gte: start, $lt: end },
            }).lean();

            if (tickets.length > 0) {
                const ticketData = tickets.map(ticket => ({
                    id1: ticket.id,
                    byUser: ticket.byUser,
                    colour: ticket.colour,
                    model: ticket.model,
                    deliveryAmount: ticket.deliveryAmount,
                    gatePass: ticket.gatePass,
                    engineNo: ticket.engineNo,
                    location: ticket.location,
                    chassisNo: ticket.chassisNo,
                    assignedEngineer: ticket.assignedEngineer,
                    nameCus: ticket.nameCus,
                    executive: ticket.executive,
                    hp: ticket.hp,
                    createdAt: ticket.createdAt,
                    createdOn: ticket.createdOn,
                    issueFinance: ticket.issueFinance,
                    issueAmount: ticket.issueAmount,
                    bookingAmount: ticket.bookingAmount,
                    vehicleNumber: ticket.vehicleNumber,
                    approvedDate: ticket.approvedDate,
                    logs: JSON.stringify(ticket.logs) // stringify logs array to avoid issues in Excel
                }));

                console.log(`Duration: ${duration}, Tickets Data: `, ticketData); // Add logging to debug

                const worksheet = XLSX.utils.json_to_sheet(ticketData);
                XLSX.utils.book_append_sheet(workbook, worksheet, `${duration} Tickets`);
            }
        }

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Disposition', 'attachment; filename=tickets_all_durations.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(excelBuffer);

    } catch (err) {
        console.error('Error in exportTickets:', err); // Add logging to debug
        res.json({ status: 400, error: err.message });
    }
};

const fetchEngineers = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (user_id !== req.userId) {
            return res.sendStatus(403);
        }

        // Fetch all users tickets from the database
        const engineers = await UserData.find({ role: "engineer" });
        res.json({ status: 200, engineers });
    } catch (error) {
        res.json({ status: "error", error: "Failed to fetch engineers" });
    }
};

const assignRole = async (req, res) => {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }
    // Find user who matches the email address and set to engineer
    const user = await UserData.findOneAndUpdate(
        { email: req.body.email },
        { role: "engineer" },
        { new: true }
    );
    if (!user) {
        return res.json({ status: 501, text: "User not found" });
    }
    return res.json({ status: 200 });
};

const setEngineer = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { assignedEngineer: req.body.engineerId },
        { new: true }
    );
    if (!ticket) {
        return res.json({ status: 501, text: "Error in assigning engineer" });
    }
    return res.json({ status: 200 });
};

const acceptTicket = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { accepted: 1 },
        { new: true }
    );

    if (!ticket) {
        return res.json({ status: 501, text: "Error in accepting the ticket." });
    }
    return res.json({ status: 200 });
};

const setPriority = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    const { priority } = req.body;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { priority: priority },
        { new: true }
    );

    if (!ticket) {
        return res.json({ status: 501, text: "Error in setting priority." });
    }
    return res.json({ status: 200 });
};

const setProblem = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    const { Problem } = req.body;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { Problem: Problem },
        { new: true }
    );

    if (!ticket) {
        return res.json({ status: 501, text: "Error in setting Problem." });
    }
    return res.json({ status: 200 });
};

const setServiceType = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    const { ServiceType } = req.body;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { ServiceType: ServiceType },
        { new: true }
    );

    if (!ticket) {
        return res.json({ status: 501, text: "Error in setting ServiceType." });
    }
    return res.json({ status: 200 });
};

const setAMC = async (req, res) => {
    const { user_id } = req.params;
    const { ticket_id } = req.params;
    const { AMC } = req.body;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndUpdate(
        { id: ticket_id },
        { AMC: AMC },
        { new: true }
    );

    if (!ticket) {
        return res.json({ status: 501, text: "Error in setting AMC." });
    }
    return res.json({ status: 200 });
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
        { new: true }
    );

    res.json({ status: 200 });
};

const deleteTicket = async (req, res) => {
    const { user_id, ticket_id } = req.params;
    if (user_id !== req.userId) {
        return res.sendStatus(403);
    }

    const ticket = await Ticket.findOneAndDelete({ id: ticket_id });

    if (!ticket) {
        res.json({ status: 401 });
    }
    res.json({ status: 200 });
};

module.exports = {
    fetchTickets,
    exportTickets,
    fetchEngineers,
    assignRole,
    setEngineer,
    acceptTicket,
    setPriority,
    setProblem,
    setServiceType,
    setAMC,
    addMessage,
    deleteTicket,
};