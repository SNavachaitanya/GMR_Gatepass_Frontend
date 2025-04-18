import React, { useState } from 'react';
import './styles/Pass.css';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AdminPass = () => {
  const [rollNo, setRollNo] = useState('');
  const [userData, setUserData] = useState(null);
  const [fingerprintData, setFingerprintData] = useState(null);
  const [error, setError] = useState('');
  const [expectedOutTime, setExpectedOutTime] = useState('');
  const [expectedInTime, setExpectedInTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleVerifyPinkPass = async () => {
    setFingerprintData(null);
    setError('');
    
    if (!rollNo || !expectedOutTime || !expectedInTime) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://82.29.162.24:3300/verify-roll/${rollNo}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError('');
        await updateGatepassIssue(rollNo, expectedOutTime, expectedInTime);
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
    } finally {
      setLoading(false);
    }
  };

  const updateGatepassIssue = async (rollNo, outTime, inTime) => {
    try {
      const currentDateTime = new Date();
      const expectedDateTime = new Date(outTime);
      const expectedInDateTime = new Date(inTime);
      
      if(expectedDateTime < currentDateTime){
        setError('Invalid Expected out time');
        return;
      }

      if(expectedInDateTime < expectedDateTime){
        setError('In time cannot be less than out Time');
        return;
      }

      const timeDifference = (expectedDateTime - currentDateTime);
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference > 48) {
        setError('You cannot issue a pink pass more than 48 hours in advance.');
        return;
      }

      const response = await axios.post('http://82.29.162.24:3300/update-gatepass-issue', {
        roll_no: rollNo,
        expected_out_time: expectedDateTime,
        expected_in_time: expectedInDateTime
      });

      if (response.data.success) {
        await handleSendGatepassEmail(rollNo);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update gatepass');
      throw err;
    }
  };

  const handleVerifyFingerprint = async () => {
    setUserData(null);
    setError('');
    
    if (!expectedOutTime || !expectedInTime) {
      setError('Please enter expected times');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3301/run-jar-verify');
      const data = response.data;

      if (data?.studentId) {
        setFingerprintData(data);
        await updateGatepassIssue(data.studentId, expectedOutTime, expectedInTime);
      } else {
        setError('No user found');
      }
    } catch (error) {
      console.error(error);
      setError('Fingerprint error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendGatepassEmail = async (studentID) => {
    try {
      const response = await axios.post('http://82.29.162.24:3300/send-gatepass-email', {
        studentID
      });

      if (response.data.success) {
        enqueueSnackbar('Gatepass details sent to student email!', { 
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      } else {
        throw new Error(response.data.message || 'Failed to send gatepass details');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      enqueueSnackbar(err.message, { 
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
      throw err;
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold">PinkPass Generation</h1>
      
      <div className="button-container text-center mb-5">
        <button 
          onClick={handleVerifyFingerprint}
          disabled={loading}
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 hidden-mobile"
        >
          {loading ? 'Processing...' : 'Generate using Fingerprint'}
        </button>
        <button 
          onClick={handleVerifyPinkPass}
          disabled={loading}
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-gray-600 transition duration-200 ml-2"
        >
          {loading ? 'Processing...' : 'Generate using Roll Number'}
        </button>
      </div>

      <input 
        type="text" 
        value={rollNo} 
        onChange={(e) => setRollNo(e.target.value)} 
        placeholder="Enter Roll Number" 
        className="border rounded w-full md:w-1/3 py-2 mx-auto mb-4 block mobile-padding"
      />

      <div className="mb-4">
        <label className="block text-white text-center">
          Expected Out Time
          <input
            type="datetime-local"
            value={expectedOutTime}
            onChange={(e) => setExpectedOutTime(e.target.value)}
            className="border rounded text-gray-700 w-full md:w-1/3 px-3 py-2 mx-auto block mobile-padding"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-white text-center">
          Expected In Time
          <input
            type="datetime-local"
            value={expectedInTime}
            onChange={(e) => setExpectedInTime(e.target.value)}
            className="border rounded text-gray-700 w-full md:w-1/3 px-3 py-2 mx-auto block mobile-padding"
          />
        </label>
      </div>

      {error && <p style={{
            color: 'white',
            textAlign: 'center',
            backgroundColor: 'red',
            opacity:0.7,
            fontWeight: 'bold',
            fontSize: 'px',
            padding: '8px',
            borderRadius: '9px',
            margin: '10px auto',
            maxWidth: '400px',
          }}
      >{error}</p>}

      {(!error) && (userData || fingerprintData) && (
        <div className="mt-8">
          <div className="flex items-center bg-white shadow-md p-6 rounded-lg mx-auto" style={{ maxWidth: '800px' }}>
            {(userData || fingerprintData).imageUrl ? (
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
              <div><strong>Expected Out Time:</strong> {new Date(expectedOutTime).toLocaleString()}</div>
              <div><strong>Expected In Time:</strong> {new Date(expectedInTime).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPass;