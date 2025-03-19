import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../components/styles/Registration.css';

function Reports() {
    const [gatepassData, setGatepassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportTime, setReportTime] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState('all'); // State for dropdown
    const rowsPerPage = 10;

    const handleFilter = () => {
        // If fromDate or toDate is not selected, set them to current date
        const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const selectedFromDate = fromDate || today;
        const selectedToDate = toDate || today;

        if (selectedFromDate && selectedToDate) {
            setFromDate(selectedFromDate);
            setToDate(selectedToDate);
            fetchData(selectedFromDate, selectedToDate);
        } else {
            alert("Please select both 'From' and 'To' dates.");
        }
    };

    const fetchData = async (from, to) => {
        setLoading(true);
        try {
            const response = await axios.get('http://82.29.162.24:3300/current-gatepass-report-filtered', {
                params: { from, to, type: filterType },
            });
            setGatepassData(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching gatepass data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://82.29.162.24:3300/current-gatepass-report');
                setGatepassData(response.data);
            } catch (error) {
                console.error('Error fetching gatepass data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownload = async (filterType) => {
        try {
            const response = await axios.get('http://82.29.162.24:3300/download-current-gatepass-report', {
                params: { filterType },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `CurrentGatepassData_${filterType}.xlsx`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    const handleSaveTime = async () => {
        try {
            await axios.post('http://82.29.162.24:3300/save-report-time', { time: reportTime });
            alert('Report time saved successfully!');
        } catch (error) {
            console.error('Error saving report time:', error);
        }
    };

    const handleSendReport = async () => {
        setLoading(true);
        try {
            const reportData = {
                fromDate: fromDate || new Date().toISOString().split('T')[0],
                toDate: toDate || new Date().toISOString().split('T')[0],
                filterType: filterType,
            };

            await axios.post('http://82.29.162.24:3300/send-report', reportData);
            alert('Report sent successfully!');
        } catch (error) {
            console.error('Error sending report:', error);
            alert('Failed to send report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = gatepassData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(gatepassData.length / rowsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner border-t-4 border-gray-800 rounded-full w-16 h-16 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-center font-bold text-gray-800 mb-4 mt-4">Current Report</h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-4">
                {/* Date Fields and Filter Dropdown */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full md:w-48 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full md:w-48 p-2 border border-gray-300 rounded"
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full md:w-48 p-2 border border-gray-300 rounded"
                    >
                        <option value="all">All</option>
                        <option value="gatepass">Gatepass</option>
                        <option value="outpass">Outpass</option>
                    </select>
                </div>
                {/* Filter and Send Report Buttons */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <button
                        className="w-full md:w-auto bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200"
                        onClick={handleFilter}
                    >
                        Filter
                    </button>
                    <button
                        className="w-full md:w-auto bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200"
                        onClick={handleSendReport}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} /> Send Report
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-gray-900 text-center">
                    <thead>
                        <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Roll No</th>
                            <th className="p-2">Year</th>
                            <th className="p-2">Branch</th>
                            <th className="p-2">Hostel Block</th>
                            <th className="p-2">Room No</th>
                            <th className="p-2">Parent No</th>
                            <th className="p-2">Out Time</th>
                            <th className="p-2">In Time</th>
                            <th className="p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{row.sname}</td>
                                <td className="p-2">{row.studentId}</td>
                                <td className="p-2">{row.syear}</td>
                                <td className="p-2">{row.branch}</td>
                                <td className="p-2">{row.hostelblock}</td>
                                <td className="p-2">{row.roomno}</td>
                                <td className="p-2">{row.parentno}</td>
                                <td className="p-2">{row.outTime}</td>
                                <td className="p-2">{row.inTime}</td>
                                <td className="p-2">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`text-gray font-bold py-2 px-3 rounded shadow-md transition duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <span className="text-gray">Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`text-gray font-bold py-2 px-3 rounded shadow-md transition duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2">
                <button
                    className="w-full md:w-auto bg-gray-900 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200"
                    onClick={() => handleDownload(filterType)}
                >
                    Download Current Report
                </button>
                <div className="flex items-center gap-2">
                    <input
                        type="time"
                        value={reportTime}
                        onChange={(e) => setReportTime(e.target.value)}
                        className="w-full md:w-auto p-2 border border-gray-300 rounded"
                    />
                    <button
                        className="w-full md:w-auto bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200"
                        onClick={handleSaveTime}
                    >
                        Save Time
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Reports;