import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import Autocomplete from '../../components/Autocomplete';

const CreateUserTicket = () => {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const [colour, setColour] = useState("");
    const [model, setModel] = useState("");
    const [engineNo, setEngineNo] = useState("");
    const [chassisNo, setChassisNo] = useState("");
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState('single');
    const [location, setlocation] = useState("");
    const [engineerId, setEngineerId] = useState("");
    const [engineerName, setEngineerName] = useState("");
    const [engineerInfo, setEngineerInfo] = useState([]);

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const res = await axios.get(`/api/admin/${user_id}/engineers`);
                const data = res.data;
                if (data.status === 200) {
                    const engineerList = data.engineers;
                    const engineerInfoScope = engineerList.map((engineer) => [engineer.name, engineer.userId]);
                    setEngineerInfo(engineerInfoScope);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchEngineers();
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

            // Map engineer names to IDs
            const engineerMap = Object.fromEntries(engineerInfo);
            const jsonWithIds = json.map(row => ({
                ...row,
                assignedEngineer: engineerMap[row.assignedEngineer]
            }));

            // Check for unmatched engineer names
            const unmatchedEngineers = jsonWithIds.filter(row => !row.assignedEngineer);
            if (unmatchedEngineers.length > 0) {
                toast.error('Some engineer names in the file do not match any registered engineer.');
                console.error('Unmatched engineers:', unmatchedEngineers);
                return null;
            }

            console.log(jsonWithIds);  // Log the processed JSON
            toast.success('File successfully processed. Data logged to console.');
            return jsonWithIds;
        } catch (error) {
            toast.error('Error processing the file: ' + error.message);
            console.error(error.message);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const baseURL = `/api/user/${user_id}`;

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
            const newComplaint = { colour, model, chassisNo, engineNo, location, assignedEngineer: engineerId };
            try {
                const response = await axios.post(`/api/user/${user_id}/createticket`, newComplaint, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.status === 200) {
                    toast.success('Your ticket has been successfully created.');
                    navigate(`/user/${user_id}/tickets`);
                } else {
                    toast.error('An error occurred while creating your ticket.');
                }
            } catch (error) {
                console.error(error.message);
                toast.error('An error occurred while creating your ticket: ' + error.message);
            }
        }

        setColour("");
        setModel("");
        setChassisNo("");
        setEngineNo("");
        setlocation("");
        setEngineerId("");
        setEngineerName("");
    };

    const handleInputChange = (value) => {
        setEngineerId(value[1]);
        setEngineerName(value[0]);
    };

    return (
        <>
            <div className="flex flex-col items-center pt-10 lg:pt-20 min-h-screen">
                <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Add Details of Bikes.
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="inputType">Add Details:</label>
                        <select
                            id="inputType"
                            className="ml-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value)}
                        >
                            <option value="single">Single</option>
                            <option value="bulk">Bulk</option>
                        </select>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {inputType === 'single' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Colour"
                                        value={colour}
                                        onChange={(e) => setColour(e.target.value)}
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Model"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="CHASSIS NO"
                                        value={chassisNo}
                                        onChange={(e) => setChassisNo(e.target.value)}
                                    />
                                    <input
                                        required
                                        type="text"
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ENGINE NO"
                                        value={engineNo}
                                        onChange={(e) => setEngineNo(e.target.value)}
                                    />
                                </div>
                                {/* <div className="flex flex-col sm:flex-row items-center">
                                    <label className="w-full sm:w-1/3">Location:</label>
                                    <select
                                        className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={location}
                                        onChange={(e) => setlocation(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select location.
                                        </option>
                                        <option value="Vashi">Vashi</option>
                                        <option value="Thane">Thane</option>
                                        <option value="Ghansoli">Ghansoli</option>
                                        <option value="Airoli">Airoli</option>
                                    </select>
                                </div> */}
                                <div className="flex flex-col sm:flex-row items-center">
                                    <label className="w-full sm:w-1/3">Assign Engineer:</label>
                                    <Autocomplete
                                        suggestions={engineerInfo}
                                        setEngineerId={handleInputChange}
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
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateUserTicket;