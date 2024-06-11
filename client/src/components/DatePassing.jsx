// client/src/components/CreateUpdateTicket.jsx

import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from 'prop-types';

const DatePassing = ({ setdatePassing, ticket }) => {
  const { user_id } = useParams();
  const navigate = useNavigate();

  // states for all the input fields
  const [name, setName] = useState(ticket.name);
  const [companyName, setcompanyName] = useState(ticket.companyName);
    const [email, setEmail] = useState(ticket.email);
    const [colour, setcolour] = useState("");
  const [issue, setIssue] = useState(ticket.issue);
  const [showIssueInput, setShowIssueInput] = useState(false);
  const [remarks, setRemarks] = useState(ticket.remarks);
  const [phone, setPhone] = useState(ticket.phoneNumber);
    const [email1, setEmail1] = useState("");
  const [landline, setLandline] = useState(ticket.landlineNumber);
  const [department, setDepartment] = useState(ticket.department);
  const [classification, setClassification] = useState("");
  const [showClassificationInput, setShowClassificationInput] = useState(false);
  const [channel, setChannel] = useState(ticket.channel);
    const [status, setStatus] = useState(null);
    const [bookingAmount, setbookingAmount] = useState(ticket.bookingAmount);
    const [customers, setCustomers] = useState([]);
    const [nameCus, setnameCus] = useState(ticket.nameCus);
    const [executive, setexecutive] = useState(ticket.executive);
    const [hp, sethp] = useState(ticket.hp);
    const [vehicleNumber, setvehicleNumber] = useState(ticket.vehicleNumber);



    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('/api/user/${user_id}/customers'); // Make sure the URL matches your API endpoint
                setCustomers(response.data);
            } catch (error) {
                console.error('Failed to fetch customers', error);
            }
        };

        fetchCustomers();
    }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Update initiated");
    const currentDate = new Date();
    const updatedComplaint = {
      //user_id: user_id, //user_id is coming from the URL itself and then it is passed to the backend
      colour: colour,
      companyName: companyName || "",
      email: email,
      phoneNumber: phone,
      email1: email1,
      landlineNumber: landline || "",
	  department: department,
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
        executive: executive,
        hp: hp,
        vehicleNumber: vehicleNumber,
    };
    // console.log(updatedComplaint);

    try {
      const response = await axios.patch(
        `/api/user/${user_id}/datepassing`,
        updatedComplaint,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      const data = await response.data;
      // console.log(data);
      if (data.status === 200) {
        setStatus("success");
        toast.success("Your Stock has been successfully updated.");
        navigate(`/user/${user_id}/tickets`);
        // Handle the created ticket
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus(error);
    }

      
    // setUsersComplaints([...usersComplaints, newComplaint]);
    // Reset the form after submission
    setcolour("");
    setcompanyName(""), setEmail("");
    setPhone("");
    setEmail1("");
    setLandline("");
	setDepartment("");
    setIssue("");
    setChannel("");
      setRemarks("");
      setbookingAmount("");
      setnameCus("");
      setexecutive("");
      sethp("");
      setvehicleNumber("");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center m-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-3xl mx-auto my-6">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[80vh] max-h-[80vh]">
            <div className="flex items-center justify-between gap-5 p-5 border-b border-solid rounded-t border-slate-200">
              <h3 className="text-3xl font-semibold">Date of Passing.</h3>
              <button
                onClick={() => setdatePassing(false)}
                className="text-2xl text-red-500"
              >
                X
              </button>
            </div>
            <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  
                                  



                                  <input
                                      required
                                      type="text"
                                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholder="Vehicle Number"
                                      value={vehicleNumber}
                                      onChange={(e) => setvehicleNumber(e.target.value)}
                                      autoComplete="vehicleNumber"
                                  />


                </div>
                
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-40 px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Update
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


DatePassing.propTypes = {
    setUpdateTicket: PropTypes.func.isRequired,
    ticket: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        companyName: PropTypes.string,
        email: PropTypes.string,
        colour: PropTypes.string,
        issue: PropTypes.string,
        remarks: PropTypes.string,
        phoneNumber: PropTypes.string,
        email1: PropTypes.string,
        landlineNumber: PropTypes.string,
        department: PropTypes.string,
        classification: PropTypes.string,
        channel: PropTypes.string,
        deliveryAmount: PropTypes.string,
        nameCus: PropTypes.string,
        executive: PropTypes.string,
        hp: PropTypes.string,
        createdOn: PropTypes.string, // Add createdOn prop type validation
    }).isRequired,
};

export default DatePassing;
