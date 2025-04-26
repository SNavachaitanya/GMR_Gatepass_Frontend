import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FaUser } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import debounce from 'lodash.debounce';

const AllPasses = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [id, setId] = useState('');
    const [blockName, setBlockName] = useState('all');
    const [gender, setGender] = useState('all');
    const [error, setError] = useState(null);
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
            setLoading(true);
            try {
                const response = await axios.get('http://82.29.162.24:3300/all-passes');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching gatepass data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchStudentsById = async (searchId) => {
        if (searchId) {
            try {
                const response = await axios.get('http://82.29.162.24:3300/passes-filtered-by-id', {
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
            const response = await axios.get('http://82.29.162.24:3300/all-passes');
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
            const response = await axios.get('http://82.29.162.24:3300/passes-filtered', {
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

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-center font-bold text-gray-800 mb-4 mt-4 text-xl md:text-2xl">Student Details</h1>
            
            <div className="flex flex-col md:flex-row justify-center items-center mb-4 gap-2">
                <input
                    type="text"
                    value={id}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto md:max-w-xs"
                    onChange={handleInputChange}
                    placeholder='Registration Number'
                />
                
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto"
                >
                    <option value="all">-Gender-</option>
                    <option value="Female">Girls</option>
                    <option value="Male">Boys</option>
                </select>
                
                <select
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full md:w-auto"
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
                
                <button
                    className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 w-full md:w-auto"
                    onClick={handleFilter}
                >
                    Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white bg-opacity-5">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 text-left sm:text-center">Name</th>
                            <th className="py-2 px-4 text-left sm:text-center">Roll No</th>
                            <th className="py-2 px-4 text-left sm:text-center">Year</th>
                            <th className="py-2 px-4 text-left sm:text-center">Branch</th>
                            <th className="py-2 px-4 text-left sm:text-center">Hostel Block</th>
                            <th className="py-2 px-4 text-left sm:text-center">Gatepasses</th>
                            <th className="py-2 px-4 text-left sm:text-center">Outpasses</th>
                            <th className="py-2 px-4 text-center">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4">{row.sname}</td>
                                <td className="py-2 px-4">{row.studentId}</td>
                                <td className="py-2 px-4">{row.syear}</td>
                                <td className="py-2 px-4">{row.branch}</td>
                                <td className="py-2 px-4">{row.hostelblock}</td>
                                <td className="py-2 px-4">{row.gatepassCount}</td>
                                <td className="py-2 px-4">{row.outpassCount}</td>
                                <td className="py-2 px-4 text-center">
                                    <Link to={`/studentProfile/${row.studentId}`} className="flex justify-center items-center text-gray-500">
                                        View<FaUser className="ml-1 w-4 h-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-4">
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
        </div>
    );
}

export default AllPasses;