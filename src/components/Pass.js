import React, { useState,useEffect} from 'react';
import './styles/Pass.css';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const Pass = () => {
  const [qrData, setQrData] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    setUserData(null);
    setLoading(true);

    if (!qrData.trim()) {
      setError('Please scan a valid QR code');
      setLoading(false);
      return;
    }

    try {
      // Parse QR code data (should be JSON string with studentID and token)
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
        if (!parsedData.studentID || !parsedData.token) {
          throw new Error('Invalid QR code format');
        }
      } catch (e) {
        throw new Error('Invalid QR code format');
      }

      const response = await axios.post('http://82.29.162.24:3300/update-gatepass', {
        qr_data: parsedData
      });

      if (response.data.student) {
        setUserData(response.data.student);
      }

      enqueueSnackbar(response.data.message, { 
        variant: response.data.success ? 'success' : 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });

      if (response.data.success && response.data.student?.parentno) {
        await sendSMS(response.data.student.parentno);
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Error processing QR code');
      // enqueueSnackbar(err.message, { 
      //   variant: 'error',
      //   anchorOrigin: { vertical: 'top', horizontal: 'center' }
      // });
    } finally {
      setLoading(false);
    }
  };

  const sendSMS = async ( message) => {
    try {
        const response = await axios.post('http://82.29.162.24:3300/send-sms-pink', {
           
            message: message
        });
        if (response.data.success) {
            console.log('SMS sent successfully!');
            enqueueSnackbar('SMS Sent Successfully!',{variant:'success'});
        } else {
            console.error('Failed to send SMS:', response.data.message);
            enqueueSnackbar('SMS not Sent !',{variant:'error'});
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

useEffect(() => {
  console.log("Scanned QR Data:", qrData);
  if (qrData.trim() !== '') {
    handleVerify();
  }
}, [qrData]);

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold">PinkPass Checkout</h1>
      
      <div className="flex flex-col items-center mb-5">
        <input 
          type="text" 
          value={qrData} 
          onChange={(e) => setQrData(e.target.value)} 
          placeholder="Scan QR Code" 
          className="border rounded w-full md:w-1/3 px-3 py-2 mx-auto mb-4 block mobile-padding"
          autoFocus
        />
        {/* <button 
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded shadow-md hover:bg-blue-700 transition duration-200"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Verify QR Code'}
        </button> */}
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

      {userData && (
        <div className="bg-white shadow-md p-6 rounded-lg mx-auto max-w-3xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {userData.imageUrl && (
              <img 
                src={userData.imageUrl} 
                alt="Student" 
                className="h-32 w-32 object-cover rounded" 
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
              <div><strong>Name:</strong> {userData.sname}</div>
              <div><strong>Roll No:</strong> {userData.studentId}</div>
              <div><strong>Branch:</strong> {userData.branch}</div>
              <div><strong>Year:</strong> {userData.syear}</div>
              <div><strong>Checkout Time:</strong> {new Date().toLocaleTimeString()}</div>
              <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pass;