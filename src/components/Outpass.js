import React, { useState } from 'react';
import './styles/Pass.css'; // Ensure you import the CSS file for styling
import axios from 'axios';
import { useSnackbar } from 'notistack'; // For notifications

const Outpass = () => {
  const [rollNo, setRollNo] = useState('');
  const [userData, setUserData] = useState(null);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [expectedOutTime, setExpectedOutTime] = useState('');
  const [token, setToken] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Function to generate random token
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Function to verify and fetch full data for Outpass
  const handleVerifyPinkPass = async () => {
    setFingerprintData(null);
    setError1(null);
    if (rollNo.trim() === '') {
      setError('Please enter a valid Roll Number.');
      return;
    }

    // Generate a new token
    const newToken = generateToken();
    setToken(newToken);

    try {
      const response = await fetch(`http://82.29.162.24:3300/verify-roll-outpass/${rollNo}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError(''); // Clear error

        // After fetching user data, update the gatepass table with the token
        await updateGatepass(rollNo, data.parentno, newToken);
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

  // Function to verify fingerprint
  const handleVerifyFingerprint = async () => {
    setUserData(null);
    try {
      const response = await axios.post('http://localhost:3301/run-jar-verify');
      const data = response.data;

      // Assuming data is the student object now
      if (data && Object.keys(data).length > 0) {
        // Generate a new token
        const newToken = generateToken();
        setToken(newToken);
        
        setFingerprintData(data); // Set the entire student data
        await updateGatepass(data.studentId, data.parentno, newToken); // Use data.studentId
      } else {
        alert('No user found.');
      }
    } catch (error) {
      console.error('Error running JAR:', error);
    }
  };

  // Function to update gatepass with token
  const updateGatepass = async (rollNo, parentno, token) => {
    try {
      const response = await fetch(`http://82.29.162.24:3300/update-outpass-guard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_no: rollNo, token: token }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        console.error('Error updating out pass:', data.message);
      } else {
        console.log('Gate pass updated successfully.');
        setExpectedOutTime(data.expectedOutTime);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Function to send QR code via email with token
  const handleSendQRCode = async () => {
    const studentID = userData ? userData.studentId : fingerprintData?.studentId;
    if (!studentID) {
      setError('No student ID found.');
      return;
    }

    try {
      const response = await axios.post('http://82.29.162.24:3300/send-qr-code', {
        studentID,
        token: token // Include the token here
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
      <h1 className="text-center text-white text-2xl font-bold">OutPass Generation</h1>
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
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            backgroundColor: 'red',
            opacity: 0.7,
            fontWeight: 'bold',
            fontSize: 'px',
            padding: '8px',
            borderRadius: '9px',
            margin: '10px auto',
            maxWidth: '400px',
          }}
        >
          {error}
        </p>
      )}

      {(!error && userData) && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg mx-auto" style={{ maxWidth: '800px' }}>
            {/* Image Section */}
            {userData.imageUrl ? (
              <img
                src={userData.imageUrl}
                alt="Student"
                className="h-32 w-32 object-cover rounded mr-6"
              />
            ) : (
              <span>No image available</span>
            )}
            {/* Details Section */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div><strong>Name:</strong> {userData.sname}</div>
              <div><strong>Roll No:</strong> {userData.studentId}</div>
              <div><strong>Branch:</strong> {userData.branch}</div>
              <div><strong>Year:</strong> {userData.syear}</div>
              <div><strong>Hostel Name:</strong> {userData.hostelblock}</div>
              <div><strong>Room No:</strong> {userData.roomno}</div>
              <div><strong>Parent Mobile No:</strong> {userData.parentno}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <br />
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            onClick={handleSendQRCode}
          >
            Send QR Code
          </button>
        </div>
      )}

      {(!error && fingerprintData) && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg mx-auto" style={{ maxWidth: '800px' }}>
            {/* Image Section */}
            {fingerprintData.imageUrl ? (
              <img
                src={fingerprintData.imageUrl}
                alt="Student"
                className="h-32 w-32 object-cover rounded mr-6"
              />
            ) : (
              <span>No image available</span>
            )}
            {/* Details Section */}
            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              <div><strong>Name:</strong> {fingerprintData.sname}</div>
              <div><strong>Roll No:</strong> {fingerprintData.studentId}</div>
              <div><strong>Branch:</strong> {fingerprintData.branch}</div>
              <div><strong>Year:</strong> {fingerprintData.syear}</div>
              <div><strong>Hostel Name:</strong> {fingerprintData.hostelblock}</div>
              <div><strong>Room No:</strong> {fingerprintData.roomno}</div>
              <div><strong>Parent Mobile No:</strong> {fingerprintData.parentno}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</div>
              <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
          <br />
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            onClick={handleSendQRCode}
          >
            Send QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default Outpass;