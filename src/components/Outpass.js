import React, { useState } from 'react';
import './styles/Pass.css';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Outpass = () => {
  const [rollNo, setRollNo] = useState('');
  const [userData, setUserData] = useState(null);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [expectedOutTime, setExpectedOutTime] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleVerifyPinkPass = async () => {
    setFingerprintData(null);
    setError1(null);
    if (rollNo.trim() === '') {
      setError('Please enter a valid Roll Number.');
      return;
    }

    try {
      const response = await fetch(`http://82.29.162.24:3300/verify-roll-outpass/${rollNo}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError('');
        await updateGatepass(rollNo, data.parentno);
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

  const handleVerifyFingerprint = async () => {
    setUserData(null);
    try {
      const response = await axios.post('http://localhost:3301/run-jar-verify');
      const data = response.data;

      if (data && Object.keys(data).length > 0) {
        setFingerprintData(data);
        await updateGatepass(data.studentId, data.parentno);
      } else {
        alert('No user found.');
      }
    } catch (error) {
      console.error('Error running JAR:', error);
    }
  };

  const updateGatepass = async (rollNo, parentno) => {
    try {
      const response = await fetch(`http://82.29.162.24:3300/update-outpass-guard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roll_no: rollNo }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        console.error('Error updating out pass:', data.message);
      } else {
        console.log('Gate pass updated successfully.');
        setExpectedOutTime(data.expectedOutTime);
        await handleSendOutpassEmail(rollNo);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSendOutpassEmail = async (studentID) => {
    if (!studentID) {
      setError('No student ID found.');
      return;
    }

    try {
      const response = await axios.post(`http://82.29.162.24:3300/send-outpass-email`, {
        studentID
      });

      if (response.data.success) {
        enqueueSnackbar('Outpass details sent to student email!', { variant: 'success' });
      } else {
        enqueueSnackbar(response.data.message || 'Failed to send outpass details.', { 
          variant: 'error' 
        });
      }
    } catch (err) {
      console.error('Error sending outpass details:', err);
      let errorMessage = 'Error sending email';
      if (err.response) {
        errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check connection.';
      }
      enqueueSnackbar(errorMessage, { variant: 'error' });
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

      {(!error && (userData || fingerprintData)) && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg mx-auto" style={{ maxWidth: '800px' }}>
            {(userData?.imageUrl || fingerprintData?.imageUrl) ? (
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
        </div>
      )}

      <style jsx>{`
        @media (max-width: 600px) {
          .hidden-mobile {
            display: none;
          }
          .mobile-padding {
            width: calc(100% - 32px);
            margin-left: auto;
            margin-right: auto;
            padding-left: 20px;
            padding-right: 20px;
          }
          .button-container {
            flex-direction: column;
          }
          .button-container button {
            margin-left: 0;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Outpass;