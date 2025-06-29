import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFemale, FaMale, FaWpforms, FaBan } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date as default

  useEffect(() => {
    const fetchData = async (date) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://82.29.162.24:3300/dashboard-data`, {
          params: { date: date || selectedDate },
        });
        setDashboardData(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

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
          <span className="block sm:inline"> Internet Connection Issue</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-2 pt-10">
        {/* Left Section (Two Rows of Cards) */}
        <div className="flex flex-col gap-4 w-full md:w-2/3">
          {/* First Row */}
          <div className="flex flex-col sm:flex-row px-10">
            <div className="w-full max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link to="/getStudents">
                <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.totalStudents}</h6>
                <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Total students in hostel</h5>
              </Link>
              <div className="flex items-center space-x-4 mt-2">
                <Link to="" className="flex items-center">
                  <FaFemale className="text-pink-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Girls : {dashboardData.totalGirls}
                  </p>
                </Link>
                <div className="border-l-2 border-gray-300 mx-4 h-8" />
                <Link to="#" className="flex items-center">
                  <FaMale className="text-blue-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Boys : {dashboardData.totalBoys}
                  </p>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link to="/passes">
                <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.totalPasses}</h6>
                <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Total passes issued</h5>
              </Link>
              <div className="flex items-center space-x-4 mt-2">
                <Link to="#" className="flex items-center">
                  <FaWpforms className="text-pink-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Pinkpass : {dashboardData.pinkPass}
                  </p>
                </Link>
                <div className="border-l-2 border-gray-300 mx-4 h-8" />
                <Link to="#" className="flex items-center">
                  <FaWpforms className="text-gray-400 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Outpass : {dashboardData.outPass}
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col sm:flex-row px-10">
            <div className="w-full max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link to="/present">
                <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.present}</h6>
                <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Total students present in hostel</h5>
              </Link>
              <div className="flex items-center space-x-4 mt-2">
                <Link to="#" className="flex items-center">
                  <FaFemale className="text-pink-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Girls : {dashboardData.presentGirls}
                  </p>
                </Link>
                <div className="border-l-2 border-gray-300 mx-4 h-8" />
                <Link to="#" className="flex items-center">
                  <FaMale className="text-blue-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Boys : {dashboardData.presentBoys}
                  </p>
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm p-6 m-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <Link to="/notpresent">
                <h6 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{dashboardData.notRet}</h6>
                <h5 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white"> Total students yet to return</h5>
              </Link>
              <div className="flex items-center space-x-4 mt-2">
                <Link to="#" className="flex items-center">
                  <FaFemale className="text-pink-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Girls : {dashboardData.notRetGirls}
                  </p>
                </Link>
                <div className="border-l-2 border-gray-300 mx-4 h-8" />
                <Link to="#" className="flex items-center">
                  <FaMale className="text-blue-300 w-6 h-6" />
                  <p className="ml-2 font-semibold text-gray-500 dark:text-white text-sm">
                    Boys : {dashboardData.notRetBoys}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Daily Report Card) */}
        <div className="col-span-1 w-full md:w-1/3 p-8  mr-4  mb-4  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-4 text-xl text-center font-semibold tracking-tight text-gray-700 dark:text-white">Daily Report</h5>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="p-2 mb-6 w-full text-center border border-gray-300 rounded-md"
          />
          <div className="flex flex-col sm:flex-row justify-evenly">
            <div>
              <h4 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Girls</h4>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                Pinkpass Issued: {dashboardData.todaysGatepassGirlsIssued}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                Pinkpass: {dashboardData.todaysGatepassGirls}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                <div className="flex flex-row">
                  Outpass: <FaBan className="text-gray-500 w-4 h-3 ml-1 mt-1" />
                </div>
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                CheckOut:  {dashboardData.todaysGatepassGirls}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                CheckIn:  {dashboardData.todaysInTimeGirls}
              </p>
            </div>
            <div className="border-l-2 border-gray-300 mx-4 h-35" />

            <div>
              <h4 className="text-xl font-semibold tracking-tight text-gray-700 dark:text-white">Boys</h4>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                Pinkpass Issued: {dashboardData.todaysGatepassBoysIssued}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                Pinkpass:  {dashboardData.todaysGatepassBoys}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                Outpass:  {dashboardData.todaysOutpassBoys}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                CheckOut:  {dashboardData.todaysOutTimeBoys}
              </p>
              <p className="mt-2 font-semibold text-gray-500 dark:text-white text-sm">
                CheckIn:  {dashboardData.todaysInTimeBoys}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;