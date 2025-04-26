import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotReturned = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [id, setId] = useState('');
    const [blockName, setBlockName] = useState('all');
    const [gender, setGender] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    
    const handleFilter = () => {
        if (id) {
            fetchStudentsById(id);
        } else {
            fetchData();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://82.29.162.24:3300/not-present-students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching gatepass data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchStudentsById = async (searchId) => {
        if (searchId) {
            try {
                const response = await axios.get('http://82.29.162.24:3300/not-present-student-filtered-by-id', {
                    params: { id: searchId || '' }
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students by ID:', error);
            }
        } else {
            setStudents([]);
        }
    };

    const fetchDataAll = async () => {
        try {
            const response = await axios.get('http://82.29.162.24:3300/not-present-students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching gatepass data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const searchId = e.target.value;
        setId(searchId);
        if (searchId) {
            fetchStudentsById(searchId);
        } else {
            fetchDataAll();
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://82.29.162.24:3300/not-present-student-filtered', {
                params: { gender, blockName } 
            });
            setStudents(response.data);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching gatepass data:', error);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = students.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(students.length / rowsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner border-t-4 border-gray-800 rounded-full w-16 h-16 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4">
            <h1 className="text-center font-bold text-gray-800 mb-4 mt-4 text-xl md:text-2xl">Students Not Returned to Hostel</h1>
            
            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row justify-center mb-4 gap-2">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                        type="text"
                        value={id}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded p-2 w-full sm:w-auto flex-grow"
                        placeholder='Registration Number'
                    />
                    
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full sm:w-auto"
                    >
                        <option value="all">-Gender-</option>
                        <option value="Female">Girls</option>
                        <option value="Male">Boys</option>
                    </select>
                    
                    <select
                        value={blockName}
                        onChange={(e) => setBlockName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full sm:w-auto"
                    >
                        <option value="all">-Block-</option>
                        <option value="Satpura">SATPURA</option>
                        <option value="Himalaya">HIMALAYA</option>
                        <option value="Aravali">ARAVALI</option>
                        <option value="Nilgiri">NILGIRI</option>
                        <option value="Vindhya">VINDHYA</option>
                        <option value="Vamsadhara">VAMSADHARA</option>
                        <option value="Nagavali">NAGAVALI</option>
                    </select>
                </div>
                
                <button
                    className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 w-full sm:w-auto"
                    onClick={handleFilter}
                >
                    Filter
                </button>
            </div>

            {/* Table with horizontal scrolling */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 text-left sm:text-center">Name</th>
                            <th className="py-2 px-4 text-left sm:text-center">Roll No</th>
                            <th className="py-2 px-4 text-left sm:text-center">Year</th>
                            <th className="py-2 px-4 text-left sm:text-center">Branch</th>
                            <th className="py-2 px-4 text-left sm:text-center">Hostel Block</th>
                            <th className="py-2 px-4 text-left sm:text-center">Room No</th>
                            <th className="py-2 px-4 text-left sm:text-center">Parent No</th>
                            <th className="py-2 px-4 text-left sm:text-center">View</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentRows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4">{row.sname}</td>
                                <td className="py-2 px-4">{row.studentId}</td>
                                <td className="py-2 px-4">{row.syear}</td>
                                <td className="py-2 px-4">{row.branch}</td>
                                <td className="py-2 px-4">{row.hostelblock}</td>
                                <td className="py-2 px-4">{row.roomno}</td>
                                <td className="py-2 px-4">{row.parentno}</td>
                                <td className="px-3 py-3 whitespace-nowrap text-sm text-center">
                                    <Link to={`/studentProfile/${row.studentId}`} className="inline-flex items-center text-gray-500 hover:text-gray-700">
                                        View <FaUser className="ml-1 w-3 h-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 px-2">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`flex items-center justify-center px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`flex items-center justify-center px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                </button>
            </div>
        </div>
    );
}

export default NotReturned;