import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const StockFilter1 = () => {
    const { user_id } = useParams();
    const [userTickets, setUserTickets] = useState([]);
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

    const locationData = userTickets.reduce((acc, ticket) => {
        const location = ticket.location;
        if (!acc[location]) {
            acc[location] = { total: 0, allotted: 0, open: 0, soldButNotDelivered: 0 };
        }
        acc[location].total += 1;
        // Example logic to categorize as 'allotted', 'open', or 'soldButNotDelivered'
        // Adjust this according to the actual properties you want to use
        if (ticket.status === 'allotted') {
            acc[location].allotted += 1;
        } else if (ticket.status === 'open') {
            acc[location].open += 1;
        } else if (ticket.status === 'soldButNotDelivered') {
            acc[location].soldButNotDelivered += 1;
        }
        return acc;
    }, {});

    const locationArray = Object.keys(locationData).map(location => ({
        showroom: location,
        ...locationData[location],
    }));

    return (
        <div className="bg-gradient-to-br from-blue-500 to-green-200 min-h-screen p-4">
            <div className="w-full max-w-8xl p-4 bg-white rounded-lg shadow-lg mx-auto">
                <div className="h-full p-4 bg-gray-100 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Stock Details</h2>
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">Total Stock</h3>
                        <p className="text-4xl font-bold">{userTickets.length}</p>
                    </div>
                    <CustomTable data={locationArray} />
                </div>
            </div>
        </div>
    );
};

const CustomTable = ({ data }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Showroom Data</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Showroom</th>
                        <th className="py-2 px-4 border-b">Total</th>
                        <th className="py-2 px-4 border-b">Allotted</th>
                        <th className="py-2 px-4 border-b">Open</th>
                        <th className="py-2 px-4 border-b">Sold but not delivered</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b">{item.showroom}</td>
                            <td className="py-2 px-4 border-b">{item.total}</td>
                            <td className="py-2 px-4 border-b">{item.allotted}</td>
                            <td className="py-2 px-4 border-b">{item.open}</td>
                            <td className="py-2 px-4 border-b">{item.soldButNotDelivered}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-2 px-4 border-b">Total</td>
                        <td className="py-2 px-4 border-b">{data.reduce((sum, item) => sum + item.total, 0)}</td>
                        <td className="py-2 px-4 border-b">{data.reduce((sum, item) => sum + item.allotted, 0)}</td>
                        <td className="py-2 px-4 border-b">{data.reduce((sum, item) => sum + item.open, 0)}</td>
                        <td className="py-2 px-4 border-b">{data.reduce((sum, item) => sum + item.soldButNotDelivered, 0)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default StockFilter1;