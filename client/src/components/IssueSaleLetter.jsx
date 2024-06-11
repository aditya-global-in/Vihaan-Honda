import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const IssueSaleLetter = ({ setsaleLetter, ticket }) => {
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
    const [deliveryAmount, setdeliveryAmount] = useState("");
    const [issueFinance, setissueFinance] = useState(ticket.issueFinance);
    const [issueAmount, setissueAmount] = useState(ticket.issueAmount);
    const [approved, setApproved] = useState(ticket.approvedDate ? true : false);
    const [approvedDate, setApprovedDate] = useState(ticket.approvedDate || null);

    const handleToggleApproval = () => {
        setApproved(!approved);
        setApprovedDate(!approved ? new Date().toISOString() : null);
    };

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
      createdAt: currentDate.toISOString(),
      resolved: false,
      priority: "low",
      Problem: "None.",
      ServiceType: "",
      assignedEngineer: "",
        ticket_id: ticket.id,
        deliveryAmount: deliveryAmount,
        issueFinance: issueFinance,
        issueAmount: issueAmount,
        approvedDate: approvedDate
    };
    // console.log(updatedComplaint);

    try {
      const response = await axios.patch(
        `/api/user/${user_id}/saleletter`,
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
      setdeliveryAmount("");
      setissueFinance("");
      setissueAmount("");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center m-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-3xl mx-auto my-6">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-h-[80vh] max-h-[80vh]">
            <div className="flex items-center justify-between gap-5 p-5 border-b border-solid rounded-t border-slate-200">
              <h3 className="text-3xl font-semibold">Issue Sale Letter.</h3>
              <button
                onClick={() => setsaleLetter(false)}
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
                                      placeholder="Amount"
                                      value={issueAmount}
                                      onChange={(e) => setissueAmount(e.target.value)}
                                      autoComplete="issueAmount"
                                  />

                                  <select
                                      required
                                      value={issueFinance}
                                      onChange={(e) => setissueFinance(e.target.value)}
                                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                      <option value="">Select HP</option>
                                      <option value="Cash">Cash.</option>
                                      <option value="Finance">Finance.</option>
                                      </select>
                </div>

                              <div className="flex justify-center">
                                  <button
                                      type="button"
                                      onClick={handleToggleApproval}
                                      className={`w-40 px-8 py-2 ${approved ? "bg-green-500" : "bg-red-500"
                                          } text-white rounded hover:${approved ? "bg-green-600" : "bg-red-600"
                                          }`}
                                  >
                                      {approved ? "Approved" : "Not Approved"}
                                  </button>
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



export default IssueSaleLetter;
