import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextModal from "../../components/TextModal";
import CreateUpdateTicket from "../../components/CreateUpdateTicket";
import IssueSaleLetter from "../../components/IssueSaleLetter";
import DeliveryReport from "../../components/DeliveryReport";
import DatePassing from "../../components/DatePassing";

const ViewTicketDetails = () => {
    const { user_id } = useParams();
    const { ticket_id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({}); //the ticket whose info is printed deliveryAmount
    const [deliveryAmount, setdeliveryAmount] = useState("");
    const [status, setStatus] = useState(ticket.resolved);
    const [showModal, setShowModal] = React.useState(false); //to hide or show assign engineer modal
    const [engineerId, setEngineerId] = useState(""); //id passed to backend
    const [engineerName, setEngineerName] = useState(""); //used for frontend
    const [engineerInfo, setEngineerInfo] = useState([]); //passed to autocomplete
    const [nameForAE, setNameForAE] = useState(""); //to show name of assigned engineer on page load
    const [selectedPriority, setSelectedPriority] = useState("set priority"); //to set the priority of the ticket in the backend
    const [selectedProblem, setSelectedProblem] = useState("set Problem");
    const [selectedServiceType, setSelectedServiceType] =
        useState("set ServiceType");
    const [selectedAMC, setSelectedAMC] = useState("set AMC");
    const [showLogs, setShowLogs] = useState(false);
    const [textMessage, setTextMessage] = useState("");
    const [updateTicket, setUpdateTicket] = useState(false);
    const [deliveryTicket, setdeliveryTicket] = useState(false);
    const [saleLetter, setsaleLetter] = useState(false);
    const [datePassing, setdatePassing] = useState(false);
    const [partName, setPartName] = useState("");
    const [department, setDepartment] = useState("");

    const userRole = localStorage.getItem("role");
    const getRole = () => {
        switch (userRole) {
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
        }
    };


    const handlePartNameChange = (e) => {
        setPartName(e.target.value);
    };


    //initial useEffect to fetch all the tickets
    useEffect(() => {
        let isMounted = true;

        const fetchTicketDetails = async () => {
            try {
                const res = await axios.get(`/api/user/${user_id}/ticket/${ticket_id}`);
                const ticket = await res.data.ticket;

                if (isMounted) {
                    //remove this unnecessary line of code
                    setTicket(ticket);
                    setStatus(ticket.resolved);
                }
            } catch (error) {
                // Handle error
                console.log(error);
            }
        };

        fetchTicketDetails();

        return () => {
            isMounted = false;
        };
    }, [user_id, ticket_id]);

    //for loading the engineer name on page load, so that it can be used to show engineer name in assignedEngineer field.
    useMemo(() => {
        const fetchEngineers = async () => {
            try {
                const res = await axios.get(
                    `/api/admin/${user_id}/engineers`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${cookies.token}`,
                        },
                    }
                );
                const data = await res.data;
                if (data.status === 200) {
                    const engineerList = data.engineers;
                    const engineerInfoScope = engineerList.map((engineer) => [
                        engineer.name,
                        engineer.userId,
                    ]);
                    setEngineerInfo(engineerInfoScope);
                    const assignedEngineerToSet = engineerInfo.find(
                        (engineer) => engineer[1] === ticket.assignedEngineer
                    );

                    const assignedEngineerName = assignedEngineerToSet
                        ? assignedEngineerToSet[0]
                        : null;
                    // console.log("engineers fetched");
                    setNameForAE(assignedEngineerName);
                    // console.log("fetchEngineersFirst was run!");
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchEngineers();
    }, [ticket]);

    useEffect(() => {
        const updateResolvedStatus = async () => {
            try {
                await axios.put(
                    `/api/user/${user_id}/ticket/${ticket_id}/update`,
                    {
                        resolved: status,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${cookies.token}`,
                        },
                    }
                );
                // console.log("update status run!");
            } catch (error) {
                console.error(error);
            }
        };

        updateResolvedStatus();
    }, [status, user_id, ticket_id]);

    const handleAssignEngineer = async () => {
        setShowModal(true);
        try {
            const res = await axios.get(
                `/api/admin/${user_id}/engineers`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                const engineerList = data.engineers;
                const engineerInfoScope = engineerList.map((engineer) => [
                    engineer.name,
                    engineer.userId,
                ]);
                setEngineerInfo(engineerInfoScope);
                // console.log(JSON.parse(localStorage.getItem("engineers")));
            }
        } catch (err) {
            console.log(err);
        }
    };


    const handleSubmitPartName = async () => {
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/update_partName`, // Update the endpoint
                {
                    partName,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(`The part name has been set to ${partName}. Refresh page to see changes.`);
                // Optionally, clear the partName state after successful submission
                setPartName("");
            }
        } catch (err) {
            console.log(err);
        }
    };





    const handleInputChange = (value) => {
        setEngineerId(value[1]);
        setEngineerName(value[0]);
    };

    const setEngineer = async () => {
        setShowModal(false);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_engineer`,
                {
                    engineerId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The ticket has been assigned to ${engineerName}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const acceptTicket = async () => {
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/accept_ticket`
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The ticket has been accepted. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const priorityFunc = async (e) => {
        setSelectedPriority(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_priority`,
                {
                    priority: e.target.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The priority has been set to ${e.target.value}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const ProblemFunc = async (e) => {
        setSelectedProblem(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_Problem`,
                {
                    Problem: e.target.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The Problem has been set to ${e.target.value}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const ServiceTypeFunc = async (e) => {
        setSelectedServiceType(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_ServiceType`,
                {
                    ServiceType: e.target.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The ServiceType has been set to ${e.target.value}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const AMCFunc = async (e) => {
        setSelectedAMC(e.target.value);
        try {
            const res = await axios.put(
                `/api/admin/${user_id}/ticket/${ticket_id}/set_AMC`,
                {
                    AMC: e.target.value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            const data = await res.data;
            if (data.status === 200) {
                toast.success(
                    `The AMC has been set to ${e.target.value}. Refresh page to see changes.`
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sendTextMessage = async () => {
        setShowLogs(false);
        if (textMessage !== "") {
            try {
                const res = await axios.put(
                    `/api/${getRole()}/${user_id}/ticket/${ticket_id}/add_message`,
                    {
                        userRole,
                        textMessage,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${cookies.token}`,
                        },
                    }
                );
                const data = await res.data;
                if (data.status === 200) {
                    toast.success("Your comment has been added. Refresh to see changes.");
                }
            } catch (err) {
                toast.error(err);
            }
        }
    };

    const deleteFunc = async () => {
        try {
            const res = await axios.delete(
                `/api/admin/${user_id}/ticket/${ticket_id}/delete_ticket`
            );
            const data = await res.data;
            if (data.status === 200) {
                navigate(`/user/${user_id}/tickets`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-blue-500 to-green-200">
                <div className="w-full max-w-8xl p-4 bg-white rounded-lg shadow-lg ">
                    <div className="h-full max-h-10xl p-4 bg-pink rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Stock Details.</h2>
                    <table className="w-full table-fixed border-collapse">
                        <tbody className="text-gray-700">
                            <tr>
                                <td className="font-bold text-blue-800 px-2 py-1 border">Model:</td>
                                <td className="px-2 py-1 border">{ticket.model}</td>
                                <td className="font-bold text-blue-800 px-2 py-1 border">Colour:</td>
                                <td className="px-2 py-1 border">{ticket.colour}</td>
                            </tr> 
                            <tr>
                                <td className="font-bold text-blue-800 px-2 py-1 border">Chassis Number:</td>
                                <td className="px-2 py-1 border">{ticket.chassisNo}</td>
                                <td className="font-bold text-blue-800 px-2 py-1 border">Engine Number:</td>
                                    <td className="px-2 py-1 border">{ticket.engineNo}</td>
                                </tr>
                                    <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Created At:</td>
                                    <td className="px-2 py-1 border">{new Date(ticket.createdAt).toLocaleString()}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border"></td>
                                    <td className="px-2 py-1 border"></td>
                                    </tr>
                                    
                            </tbody>
                        </table>
                    </div>


                    <div className="h-full md:max-h-3xl lg:max-h-4xl p-2 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Booking Details.</h2>
                        <table className="w-full table-fixed border-collapse">
                            <tbody className="text-gray-700">

                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Customer Name:</td>
                                    <td className="px-2 py-1 border">{ticket.nameCus}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Booking Amount:</td>
                                    <td className="px-2 py-1 border">{ticket.bookingAmount}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Date of Booking:</td>
                                    <td className="px-2 py-1 border">{ticket.createdOn ? new Date(ticket.createdOn).toLocaleString() : ""}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">HP:</td>
                                    <td className="px-2 py-1 border">{ticket.hp}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">EXECUTIVE:</td>
                                    <td className="px-2 py-1 border">{ticket.executive}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border"></td>
                                    <td className="px-2 py-1 border">{ticket.priority}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                        <div className="h-full md:max-h-3xl lg:max-h-4xl p-2 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Allocation Details.</h2>
                            <table className="w-full table-fixed border-collapse">
                                <tbody className="text-gray-700">

                                    <tr>
                                        <td className="font-bold text-blue-800 px-2 py-1 border">Date of Allotment:</td>
                                        <td className="px-2 py-1 border">{ticket.department}</td>
                                        <td className="font-bold text-blue-800 px-2 py-1 border">DEALER:</td>
                                        <td className="px-2 py-1 border">{ticket.issue}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-blue-800 px-2 py-1 border">Name of Customer:</td>
                                        <td className="px-2 py-1 border">{ticket.channel}</td>
                                        <td className="font-bold text-blue-800 px-2 py-1 border"></td>
                                        <td className="px-2 py-1 border"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    
                    <div className="h-full md:max-h-3xl lg:max-h-4xl p-2 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Delivery Report.</h2>
                        <table className="w-full table-fixed border-collapse">
                            <tbody className="text-gray-700">

                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Amount:</td>
                                    <td className="px-2 py-1 border">{ticket.deliveryAmount}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Gate Pass Number:</td>
                                    <td className="px-2 py-1 border">{ticket.gatePass}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="h-full md:max-h-3xl lg:max-h-4xl p-2 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Issue Sale Letter.</h2>
                        <table className="w-full table-fixed border-collapse">
                            <tbody className="text-gray-700">

                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">DATE (Approved by accounts):</td>
                                    <td className="px-2 py-1 border">{ticket.approvedDate ? new Date(ticket.approvedDate).toLocaleString() : "Not Approved Yet."}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Amount:</td>
                                    <td className="px-2 py-1 border">{ticket.issueAmount}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">CASH OR FINANCE:</td>
                                    <td className="px-2 py-1 border">{ticket.issueFinance}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border"></td>
                                    <td className="px-2 py-1 border"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="h-full md:max-h-3xl lg:max-h-4xl p-2 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Date of Passing.</h2>
                        <table className="w-full table-fixed border-collapse">
                            <tbody className="text-gray-700">

                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Date:</td>
                                    <td className="px-2 py-1 border">{ticket.department}</td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">Vehicle number.:</td>
                                    <td className="px-2 py-1 border">{ticket.issue}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-blue-800 px-2 py-1 border">_</td>
                                    <td className="px-2 py-1 border"></td>
                                    <td className="font-bold text-blue-800 px-2 py-1 border"></td>
                                    <td className="px-2 py-1 border"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                            </div>
                        </div>
                    
            <div className="flex justify-center gap-2 py-4 border-t border-gray-300">
                <button
                    className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800 cursor-pointer"
                    onClick={() => setUpdateTicket(true)}
                >
                    Booking Entry.
                </button>
                
                <button
                    className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800 cursor-pointer"
                    onClick={() => setdeliveryTicket(true)}
                >
                    Delivery Entry.
                </button>
                <button
                    className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800 cursor-pointer"
                    onClick={() => setsaleLetter(true)}
                >
                    Issue Sale Letter.
                </button>
                <button
                    className="px-6 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-800 cursor-pointer"
                    onClick={() => setdatePassing(true)}
                >
                    Date of Passing.
                </button>
                        </div>
            <div className="flex justify-center gap-2 py-4 border-t border-gray-300">
                <button
                    className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => setStatus(!status)}
                >
                    {status ? "Amount Pending." : "Amount Fully paid."}
                </button>
                {userRole === "9087-t1-vaek-123-riop" && (
                    <button
                        onClick={handleAssignEngineer}
                        className="px-6 py-2 text-white bg-teal-500 rounded hover:bg-teal-600 cursor-pointer"
                    >
                        Transfer Stock.
                    </button>
                )}
            </div>
            

            

           




            
     
{
    showModal?(
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[50vh] max-h-[50vh]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200 cursor-pointer">
                  <h3 className="text-3xl font-semibold ">Transfer Stock.</h3>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-4 overflow-y-auto">
                  <Autocomplete
                    suggestions={engineerInfo}
                    setEngineerId={handleInputChange}
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                  
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none cursor-pointer"
                    type="button"
                    onClick={setEngineer}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}

{
    updateTicket ? (
        <CreateUpdateTicket setUpdateTicket={setUpdateTicket} ticket={ticket} />
    ) : null
            }

            {
                deliveryTicket ? (
                    <DeliveryReport setdeliveryTicket={setdeliveryTicket} ticket={ticket} />
                ) : null
            }
            {
                saleLetter ? (
                    <IssueSaleLetter setsaleLetter={setsaleLetter} ticket={ticket} />
                ) : null
            }
            {
                datePassing ? (
                    <DatePassing setdatePassing={setdatePassing} ticket={ticket} />
                ) : null
            }
    </>
    );



};


export default ViewTicketDetails;
