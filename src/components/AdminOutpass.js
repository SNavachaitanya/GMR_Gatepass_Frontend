import React, { useState } from 'react';
import './styles/Pass.css';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AdminOutpass = () => {
  const [rollNo, setRollNo] = useState('');
  const [userData, setUserData] = useState(null);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Function to generate random token
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleVerifyPinkPass = async () => {
    setFingerprintData(null);
    setError('');
    if (rollNo.trim() === '') {
      setError('Please enter a valid Roll Number.');
      return;
    }

    // Generate a new token
    const newToken = generateToken();
    setToken(newToken);

    try {
      const response = await fetch(`http://82.29.162.24/verify-roll-outpass/${rollNo}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError('');
        await updateGatepass(rollNo, newToken);
      } else if (response.status === 404) {
        setError('User not found');
        setUserData(null);
      } else {
        setError('Error fetching user data');
        setUserData(null);
      }
    } catch (err) {
      console.log(err);
      setError('Server error');
      setUserData(null);
    }
  };

  const updateGatepass = async (rollNo, token) => {
    try {
      const response = await fetch(`http://82.29.162.24/update-outpass-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_no: rollNo, token: token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        enqueueSnackbar('Outpass generated successfully!', { variant: 'success' });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update outpass');
    }
  };

  const handleVerifyFingerprint = async () => {
    setUserData(null);
    try {
      const response = await axios.post('http://82.29.162.24/run-jar-verify');
      const data = response.data;

      if (data && Object.keys(data).length > 0) {
        // Generate a new token
        const newToken = generateToken();
        setToken(newToken);
        
        setFingerprintData(data);
        await updateGatepass(data.studentId, newToken);
      } else {
        alert("No user found.");
      }
    } catch (error) {
      console.error('Error running JAR:', error);
    }
  };

  const handleSendQRCode = async () => {
    const studentID = userData ? userData.studentId : fingerprintData?.studentId;
    if (!studentID) {
      setError('No student ID found.');
      return;
    }

    try {
      const response = await axios.post(`http://82.29.162.24/send-qr-code`, {
        studentID,
        token: token // Include the token in the request
      });

      if (response.data.success) {
        enqueueSnackbar('QR code sent successfully!', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to send QR code.', { variant: 'error' });
      }
    } catch (err) {
      console.error('Error sending QR code:', err);
      enqueueSnackbar('Error sending QR code.', { variant: 'error' });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-center text-white text-2xl font-bold">Admin OutPass Generation</h1>
      
      <div className="button-container text-center mb-5">
        <button 
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 hidden-mobile" 
          onClick={handleVerifyFingerprint}
        >
          Verify Fingerprint
        </button>
        <button 
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 ml-2" 
          onClick={handleVerifyPinkPass}
        >
          Verify Roll Number
        </button>
      </div>

      <input 
        type="text" 
        value={rollNo} 
        onChange={(e) => setRollNo(e.target.value)} 
        placeholder="Enter Roll Number" 
        className="border rounded w-full md:w-1/3 px-3 py-2 mx-auto mb-4 block mobile-padding"
      />

      {error && (
        <p className="text-center bg-red-500 text-white p-2 rounded mx-auto max-w-md">
          {error}
        </p>
      )}

      {(userData || fingerprintData) && (
        <div className="mt-8">
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg mx-auto" style={{ maxWidth: '800px' }}>
            {userData?.imageUrl || fingerprintData?.imageUrl ? (
              <img 
                src={(userData || fingerprintData).imageUrl} 
                alt="Student" 
                className="h-32 w-32 object-cover rounded mr-6" 
              />
            ) : (
              <span>No image available</span>
            )}
            
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div><strong>Name:</strong> {(userData || fingerprintData).sname}</div>
              <div><strong>Roll No:</strong> {(userData || fingerprintData).studentId}</div>
              <div><strong>Branch:</strong> {(userData || fingerprintData).branch}</div>
              <div><strong>Year:</strong> {(userData || fingerprintData).syear}</div>
              <div><strong>Hostel Name:</strong> {(userData || fingerprintData).hostelblock}</div>
              <div><strong>Room No:</strong> {(userData || fingerprintData).roomno}</div>
              <div><strong>Parent Mobile No:</strong> {(userData || fingerprintData).parentno}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <button
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              onClick={handleSendQRCode}
            >
              Send QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOutpass;