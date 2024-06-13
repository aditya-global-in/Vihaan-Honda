import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bikeCursor from './motorbike_icon.png';

export const UserTickets = () => {
    const { user_id } = useParams();
    const [userTickets, setUserTickets] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedFilter1, setSelectedFilter1] = useState("all");
    const [availableModels, setAvailableModels] = useState([]);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const getRole = () => {
        switch (role) {
            case "9087-t1-vaek-123-riop":
                return "admin";
            case "2069-t2-prlo-456-fiok":
                return "engineer";
            case "4032-t3-raek-789-chop":
                return "user";
            case "5001-t4-maek-101-znop":
                return "manager";
            case "6002-t5-saek-202-kiop":
                return "supervisor";
            case "7003-t6-laek-303-jiop":
                return "accounts";
            default:
                return "";
        }
    };

    const getDisplayName = () => {
        switch (selectedFilter) {
            case "thanestock":
                return "Thane Stock";
            case "vashistock":
                return "Vashi Stock";
            case "ghansolistock":
                return "Ghansoli Stock";
            case "airolistock":
                return "Airoli Stock";
            default:
                return "All Locations Stock";
        }
    };

    const calculateTimeDifference = (createdAt) => {
        const currentDate = new Date();
        const ticketDate = new Date(createdAt);
        const timeDifference = currentDate.getTime() - ticketDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference;
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`/api/${getRole()}/${user_id}/tickets`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.data;
                if (data.status === 200) {
                    setUserTickets(data.tickets);
                    const models = Array.from(new Set(data.tickets.map(ticket => ticket.model)));
                    setAvailableModels(models);
                } else if (data.status === 403) {
                    navigate("/unauthorized");
                } else {
                    navigate("/unauthorized");
                }
            } catch (error) {
                navigate("/unauthorized");
            }
        };

        fetchTickets();
    }, [user_id, navigate]);

    const handleTicketClick = (ticketId) => {
        navigate(`/user/${user_id}/ticket_details/${ticketId}`);
    };

    const sortedTickets = userTickets.sort((a, b) => {
        if (a.resolved === b.resolved) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return a.resolved ? 1 : -1;
    });

    const filteredTickets = sortedTickets
        .filter((ticket) => {
            if (selectedFilter === "all") return true;
            switch (selectedFilter) {
                case "thanestock":
                    return ticket.location === "Thane";
                case "vashistock":
                    return ticket.location === "Vashi";
                case "ghansolistock":
                    return ticket.location === "Ghansoli";
                case "airolistock":
                    return ticket.location === "Airoli";
                default:
                    return true;
            }
        })
        .filter((ticket) => {
            if (selectedFilter1 === "all") return true;
            return ticket.model === selectedFilter1;
        });

    return (
        <div>
            <div className="p-4">
                {(role === "9087-t1-vaek-123-riop" || role === "7003-t6-laek-303-jiop") && (
                    <div className="max-w-full mx-4 sm:mx-auto sm:px-6 lg:px-8">
                        <div className="sm:flex sm:space-x-4">
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                                <div className="bg-blue-100 p-5">
                                    <div className="sm:flex sm:items-start">
                                        <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                            <h3 className="text-base leading-6 font-medium text-black-400">
                                                Total Stock.
                                            </h3>
                                            <p className="text-3xl font-bold text-black">
                                                {userTickets.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                                <div className="bg-slate-100 p-5">
                                    <div className="sm:flex sm:items-start">
                                        <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                            <h3 className="text-base leading-6 font-medium text-black-400">
                                                {getDisplayName()} { }
                                            </h3>
                                            <p className="text-3xl font-bold text-black">
                                                {filteredTickets.filter((ticket) => ticket.location === getDisplayName().split(' ')[0]).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                                <div className="bg-slate-100 p-5">
                                    <div className="sm:flex sm:items-start">
                                        <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                            <h3 className="text-base leading-6 font-medium text-black-400">
                                                {selectedFilter1} { }
                                            </h3>
                                            <p className="text-3xl font-bold text-black">
                                                {filteredTickets.filter((ticket) => ticket.model === selectedFilter1).length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-12 justify-center items-center">
                    <h2
                        className={`text-3xl font-bold text-center mb-4 col-span-12 ${role !== "2069-t2-prlo-456-fiok" && "md:col-span-10"}`}
                    >
                        Inventory
                    </h2>
                    {role !== "2069-t2-prlo-456-fiok" && (
                        <select
                            className="px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-12 md:col-span-2"
                            value={selectedFilter1}
                            onChange={(e) => setSelectedFilter1(e.target.value)}
                        >
                            <option value="all">All Models</option>
                            {availableModels.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        className="px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-12 md:col-span-2"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All Locations Stock</option>
                        <option value="thanestock">Thane Stock</option>
                        <option value="vashistock">Vashi Stock</option>
                        <option value="ghansolistock">Ghansoli Stock</option>
                        <option value="airolistock">Airoli Stock</option>
                    </select>
                </div>

                {userTickets.length === 0 ? (
                    <p className="text-lg text-center">
                        {role === "9087-t1-vaek-123-riop"
                            ? "No one has created any tickets, what a surprise! Either the systems are working really well, or not at all!"
                            : role === "2069-t2-prlo-456-fiok"
                                ? "You have not been assigned any tickets yet"
                                : "You have not created any tickets yet."}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-teal-600 text-white">
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Model</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Colour</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Chassis No</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Engine No</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Showroom</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Stock Inward Date</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Customer Name</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Booking Amount</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Date of Allotment</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Delivery</h3>
                                    </th>
                                    <th className="py-2 px-4">
                                        <h3 className="text-lg font-bold">Date of Passing</h3>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr
                                        key={ticket.id}
                                        onClick={() => handleTicketClick(ticket.id)}
                                        style={{ cursor: `url(${bikeCursor}), auto` }}
                                        className="hover:bg-gray-300 cursor-pointer"
                                        // className={
                                        //     ticket.resolved
                                        //         ? "bg-green-200 cursor-pointer border-b-2 border-slate-400 border-dashed font-semibold"
                                        //         : (ticket.createdAt && calculateTimeDifference(ticket.createdAt) === 0)
                                        //             ? "bg-white cursor-pointer border-b-2 border-gray-400 border-dashed font-bold"
                                        //             : (ticket.createdAt && calculateTimeDifference(ticket.createdAt) <= 2)
                                        //                 ? "bg-red-400 cursor-pointer border-b-2 border-gray-400 border-dashed font-bold"
                                        //                 : "bg-red-800 cursor-pointer border-b-2 border-gray-400 border-dashed font-bold text-white"
                                        // }
                                    >
                                        <td className="py-2 px-4 text-center">{ticket.model}</td>
                                        <td className="py-2 px-4 text-center">{ticket.colour}</td>
                                        <td className="py-2 px-4 text-center">{ticket.chassisNo}</td>
                                        <td className="py-2 px-4 text-center">{ticket.engineNo}</td>
                                        <td className="py-2 px-4 text-center">{ticket.location}</td>
                                        <td className="py-2 px-4 text-center">{new Date(ticket.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 text-center">{ticket.nameCus}</td>
                                        <td className="py-2 px-4 text-center">{ticket.bookingAmount}</td>
                                        <td className="py-2 px-4 text-center">{ticket.SaleDate}</td>
                                        <td className="py-2 px-4 text-center">{ticket.deliveryAmount}</td>
                                        <td className="py-2 px-4 text-center">{ticket.datePassing}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTickets;