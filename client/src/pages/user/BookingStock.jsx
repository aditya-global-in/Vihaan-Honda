import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import CreateUpdateTicket from "../../components/CreateUpdateTicket";

const BookingStock = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [addhar, setAddhar] = useState("");
    const [cusName, setCusName] = useState("");
    const [addCus, setAddCus] = useState("");
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState('single');
    const [actionType, setActionType] = useState('display');
    const [bookingAmount, setBookingAmount] = useState("");
    const [executive, setExecutive] = useState("");
    const [hp, setHp] = useState("");
    const [updateTicket, setUpdateTicket] = useState(false);
    const [status, setStatus] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({
        addhar: false,
        cusName: false,
        bookingAmount: false,
        executive: false,
    });
    const [interacted, setInteracted] = useState({
        addhar: false,
        cusName: false,
        bookingAmount: false,
        executive: false,
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`/api/user/${user_id}/customers`);
                setCustomers(response.data);
            } catch (error) {
                console.error('Failed to fetch customers', error);
            }
        };

        fetchCustomers();
    }, [user_id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return null;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            console.log(json);
            toast.success('File successfully processed. Data logged to console.');
            return json;
        } catch (error) {
            toast.error('Error processing the file: ' + error.message);
            console.error(error.message);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const baseURL = `/api/user/${user_id}`;

        const validationRegex = {
            addhar: /^\d{12}$/,
            bookingAmount: /^\d+$/,
            cusName: /^[A-Za-z ]+$/,
            executive: /^[A-Za-z ]+$/,
        };

        const isFormValid =
            validationRegex.addhar.test(addhar) &&
            validationRegex.bookingAmount.test(bookingAmount) &&
            validationRegex.cusName.test(cusName) &&
            validationRegex.executive.test(executive);

        if (!isFormValid) {
            toast.error('Please fill in all fields correctly.');
            return;
        }

        if (inputType === 'bulk') {
            const jsonData = await handleFileUpload();
            if (!jsonData) return;

            try {
                const response = await axios.post(`${baseURL}/bulkcreateticket`, jsonData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    toast.success('Bulk tickets have been successfully created.');
                    navigate(`/user/${user_id}/tickets`);
                } else {
                    toast.error('An error occurred during bulk ticket creation.');
                }
            } catch (error) {
                console.error(error);
                toast.error('An error occurred while uploading the file: ' + error.message);
            }
        } else {
            const newComplaint = { cusName, addhar, addCus, bookingAmount, executive, hp };
            try {
                const response = await axios.post(`${baseURL}/bookingstock`, newComplaint, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.status === 200) {
                    toast.success('Your Customer Detail has been successfully created.');
                    if (actionType === 'navigate') {
                        navigate(`/user/${user_id}/tickets`);
                    } else {
                        setCustomers([...customers, newComplaint]);
                    }
                } else {
                    toast.error('An error occurred while creating your ticket.');
                }
            } catch (error) {
                console.error(error.message);
                toast.error('An error occurred while creating your ticket: ' + error.message);
            }
        }

        
        setCusName("");
        setAddhar("");
        setAddCus("");
        setBookingAmount("");
        setExecutive("");
        setHp("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "addhar" && !/^\d*$/.test(value)) {
            return; 
        }

        if (name === "bookingAmount" && !/^\d*$/.test(value)) {
            return; 
        }

        if ((name === "cusName" || name === "executive") && !/^[A-Za-z ]*$/.test(value)) {
            return; 
        }

        switch (name) {
            case 'addhar':
                setAddhar(value);
                break;
            case 'cusName':
                setCusName(value);
                break;
            case 'bookingAmount':
                setBookingAmount(value);
                break;
            case 'executive':
                setExecutive(value);
                break;
            default:
                break;
        }

        const validationRegex = {
            addhar: /^\d{12}$/,
            bookingAmount: /^\d+$/,
            cusName: /^[A-Za-z ]+$/,
            executive: /^[A-Za-z ]+$/,
        };

        const isValid = validationRegex[name] ? validationRegex[name].test(value) : true;

        setErrors((prevErrors) => ({ ...prevErrors, [name]: !isValid }));
        setInteracted((prev) => ({ ...prev, [name]: true }));
    };

    const inputClasses = (field) => {
        const baseClasses = "block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300";
        const value = field === "addhar" ? addhar : field === "cusName" ? cusName : field === "bookingAmount" ? bookingAmount : executive;
        const isInteracted = interacted[field];
        let focusClasses = "focus:ring-blue-500"; // Default focus ring color

        const validationRegex = {
            addhar: /^\d{12}$/,
            bookingAmount: /^\d+$/,
            cusName: /^[A-Za-z ]+$/,
            executive: /^[A-Za-z ]+$/,
        };

        if (isInteracted && validationRegex[field]) {
            if (validationRegex[field].test(value)) {
                focusClasses = "focus:ring-green-500";
            } else if (value.length > 0) {
                focusClasses = "focus:ring-red-500";
            }
        }

        const errorClasses = isInteracted ? (errors[field] ? "border-red-500" : "border-green-500") : "";

        return `${baseClasses} ${focusClasses} ${errorClasses}`;
    };

    return (
        <>
            <div className="flex flex-col items-center pt-10 lg:pt-20 min-h-screen">
                {status === "error" ? (
                    <div className="text-red-500">
                        You are not authorized to access this page.
                    </div>
                ) : (
                    <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Add Customer Details.
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {inputType === 'single' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="text"
                                            className={inputClasses("cusName")}
                                            placeholder="Customer Name."
                                            value={cusName}
                                            name="cusName"
                                            onChange={handleChange}
                                            autoComplete="name"
                                        />
                                        <input
                                            required
                                            type="text"
                                            className={inputClasses("addhar")}
                                            placeholder="Aadhaar."
                                            value={addhar}
                                            name="addhar"
                                            onChange={handleChange}
                                            autoComplete="aadhar"
                                        />
                                        <input
                                            required
                                            type="text"
                                            className={inputClasses("bookingAmount")}
                                            placeholder="Booking Amount"
                                            value={bookingAmount}
                                            name="bookingAmount"
                                            onChange={handleChange}
                                            autoComplete="bookingAmount"
                                        />
                                        <input
                                            required
                                            type="text"
                                            className={inputClasses("executive")}
                                            placeholder="EXECUTIVE"
                                            value={executive}
                                            name="executive"
                                            onChange={handleChange}
                                            autoComplete="executive"
                                        />
                                        <select
                                            required
                                            value={hp}
                                            onChange={(e) => setHp(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select HP</option>
                                            <option value="Bajaj Finance Limited.">Bajaj Finance Limited.</option>
                                            <option value="Tata Capital Financial Services Ltd.">Tata Capital Financial Services Ltd.</option>
                                            <option value="Aditya Birla Finance Ltd.">Aditya Birla Finance Ltd.</option>
                                            <option value="Mahindra & Mahindra Financial Services Limited.">Mahindra & Mahindra Financial Services Limited.</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <textarea
                                            required
                                            type="text"
                                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Customer Address."
                                            value={addCus}
                                            onChange={(e) => setAddCus(e.target.value)}
                                            rows="4"
                                        />
                                    </div>
                                </>
                            )}

                            {inputType === 'bulk' && (
                                <div>
                                    <input
                                        type="file"
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-vihaan-honda-red text-white rounded hover:bg-vihaan-honda-red-darker w-40"
                                >
                                    Submit
                                </button>
                                <select
                                    value={actionType}
                                    onChange={(e) => setActionType(e.target.value)}
                                    className="ml-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="display">Display on Page</option>
                                    <option value="navigate">Navigate to Page</option>
                                </select>
                            </div>
                        </form>

                        {actionType === 'display' && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold mb-4">Customer Details</h3>
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b">Customer Name</th>
                                            <th className="py-2 px-4 border-b">Aadhaar</th>
                                            <th className="py-2 px-4 border-b">HP</th>
                                            <th className="py-2 px-4 border-b">Booking Amount</th>
                                            <th className="py-2 px-4 border-b">Executive</th>
                                            <th className="py-2 px-4 border-b">Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((customer, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b">{customer.cusName}</td>
                                                <td className="py-2 px-4 border-b">{customer.addhar}</td>
                                                <td className="py-2 px-4 border-b">{customer.hp}</td>
                                                <td className="py-2 px-4 border-b">{customer.bookingAmount}</td>
                                                <td className="py-2 px-4 border-b">{customer.executive}</td>
                                                <td className="py-2 px-4 border-b">{customer.addCus}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {updateTicket && (
                <CreateUpdateTicket setUpdateTicket={setUpdateTicket} ticket={{ cusName, addhar, bookingAmount, executive, hp, addCus }} />
            )}
        </>
    );
};

export default BookingStock;
