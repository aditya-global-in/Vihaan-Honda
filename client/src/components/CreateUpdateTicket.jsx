import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from 'prop-types';

const CreateUpdateTicket = ({ setUpdateTicket, ticket }) => {
    const { user_id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(ticket.issue);
    const [showIssueInput, setShowIssueInput] = useState(false);
    const [remarks, setRemarks] = useState(ticket.remarks);
    const [classification, setClassification] = useState("");
    const [showClassificationInput, setShowClassificationInput] = useState(false);
    const [channel, setChannel] = useState(ticket.channel);
    const [status, setStatus] = useState(null);
    const [bookingAmount, setBookingAmount] = useState(ticket.bookingAmount);
    const [customers, setCustomers] = useState([]);
    const [nameCus, setNameCus] = useState(ticket.nameCus);
    const [addhar, setAddhar] = useState(ticket.addhar || '');
    const [executive, setExecutive] = useState(ticket.executive);
    const [hp, setHp] = useState(ticket.hp);
    const [aadhaarOptions, setAadhaarOptions] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`/api/user/${user_id}/customers`); // Make sure the URL matches your API endpoint
                setCustomers(response.data);
            } catch (error) {
                console.error('Failed to fetch customers', error);
            }
        };

        fetchCustomers();
    }, [user_id]);

    const handleNameChange = (e) => {
        const selectedCustomer = customers.find(customer => customer.cusName === e.target.value);
        if (selectedCustomer) {
            setNameCus(selectedCustomer.cusName);
            setAadhaarOptions(customers.filter(customer => customer.cusName === selectedCustomer.cusName).map(c => c.addhar));
            setAddhar('');
            setBookingAmount('');
            setHp('');
            setExecutive('');
        } else {
            setNameCus('');
            setAadhaarOptions([]);
            setAddhar('');
            setBookingAmount('');
            setHp('');
            setExecutive('');
        }
    };

    const handleAadhaarChange = (e) => {
        const selectedCustomer = customers.find(customer => customer.addhar === e.target.value);
        if (selectedCustomer) {
            setAddhar(selectedCustomer.addhar);
            setBookingAmount(selectedCustomer.bookingAmount || '');
            setHp(selectedCustomer.hp || '');
            setExecutive(selectedCustomer.executive || '');
        } else {
            setAddhar('');
            setBookingAmount('');
            setHp('');
            setExecutive('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const currentDate = new Date();
        const updatedComplaint = {
            issue: issue || "",
            channel: channel || "",
            remarks: remarks || "",
            createdOn: ticket.createdOn || currentDate.toISOString(),
            resolved: false,
            priority: "low",
            Problem: "None.",
            ServiceType: "",
            assignedEngineer: "",
            ticket_id: ticket.id,
            bookingAmount: bookingAmount,
            nameCus: nameCus,
            addhar: addhar,
            executive: executive,
            hp: hp,
        };

        try {
            const response = await axios.patch(
                `/api/user/${user_id}/updateticket`,
                updatedComplaint,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.data;
            if (data.status === 200) {
                setStatus("success");
                toast.success("Your Stock has been successfully updated.");
                navigate(`/user/${user_id}/tickets`);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus(error);
        }

        // Reset the form after submission
        setIssue("");
        setChannel("");
        setRemarks("");
        setBookingAmount("");
        setNameCus("");
        setAddhar("");
        setExecutive("");
        setHp("");
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmed) return;

        try {
            const response = await axios.patch(
                `/api/user/${user_id}/updateticket`,
                {
                    ticket_id: ticket.id,
                    bookingAmount: "",
                    nameCus: "",
                    addhar: "",
                    executive: "",
                    hp: "",
                    createdOn: "",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.data;
            if (data.status === 200) {
                setStatus("success");
                toast.success("Booking details have been cleared.");
                navigate(`/user/${user_id}/tickets`);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus(error);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center m-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative w-auto max-w-3xl mx-auto my-6">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[80vh] max-h-[80vh]">
                        <div className="flex items-center justify-between gap-5 p-5 border-b border-solid rounded-t border-slate-200">
                            <h3 className="text-3xl font-semibold">Booking Entry.</h3>
                            <button
                                onClick={() => setUpdateTicket(false)}
                                className="text-2xl text-red-500"
                            >
                                X
                            </button>
                        </div>
                        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <select
                                        required
                                        value={nameCus}
                                        onChange={handleNameChange}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a Customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.cusName}>
                                                {customer.cusName}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        required
                                        value={addhar}
                                        onChange={handleAadhaarChange}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Aadhaar</option>
                                        {aadhaarOptions.map((aadhaar) => (
                                            <option key={aadhaar} value={aadhaar}>
                                                {aadhaar}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Booking Amount"
                                        value={bookingAmount}
                                        onChange={(e) => setBookingAmount(e.target.value)}
                                        autoComplete="bookingAmount"
                                        readOnly
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="HP."
                                        value={hp}
                                        onChange={(e) => setHp(e.target.value)}
                                        autoComplete="hp"
                                        readOnly
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="EXECUTIVE"
                                        value={executive}
                                        onChange={(e) => setExecutive(e.target.value)}
                                        autoComplete="executive"
                                        readOnly
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="w-40 px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="w-40 px-8 py-2 ml-4 text-white bg-red-500 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 opacity-60 bg-slate-900"></div>
        </>
    );
};

CreateUpdateTicket.propTypes = {
    setUpdateTicket: PropTypes.func.isRequired,
    ticket: PropTypes.shape({
        id: PropTypes.string.isRequired,
        issue: PropTypes.string,
        remarks: PropTypes.string,
        classification: PropTypes.string,
        channel: PropTypes.string,
        bookingAmount: PropTypes.string,
        nameCus: PropTypes.string,
        addhar: PropTypes.string,
        executive: PropTypes.string,
        hp: PropTypes.string,
        createdOn: PropTypes.string,
    }).isRequired,
};

export default CreateUpdateTicket;