import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Checkingate = () => {
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const sendSMS = async (message) => {
    try {
      const response = await axios.post('http://82.29.162.24:3300/send-sms-in', {
         
          message: message
      });
      if (response.data.success) {
          console.log('SMS sent Successfully!');
          enqueueSnackbar('SMS Sent Successfully!', { variant: 'success' });
      } else {
          console.error('Failed to send SMS:', response.data.message);
          enqueueSnackbar('SMS not Sent !', { variant: 'error' });
      }
  } catch (error) {
      console.error('Error sending SMS:', error);
  }
};

  const handleCheckIn = async () => {
    setError('');
    setLoading(true);

    if (!qrData.trim()) {
      setError('Please scan a valid QR code');
      setLoading(false);
      return;
    }

    try {
      // Parse QR code data (should contain studentID and token)
      let parsedData;
      try {
        parsedData = JSON.parse(qrData);
        if (!parsedData.studentID || !parsedData.token) {
          throw new Error('Invalid QR code format');
        }
      } catch (e) {
        throw new Error('Invalid QR code format');
      }

      // Perform check-in with token
      const response = await axios.patch(
        `http://82.29.162.24:3300/checkin/${parsedData.studentID}`,
        { token: parsedData.token }
      );

      // Clear input after successful check-in
      setQrData('');
      
      // Send SMS notification
      if (response.data.parentno) {
        await sendSMS(response.data.parentno);

      enqueueSnackbar('Check-in successful!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
    }
      else if (response.status === 404) {
        setError('No pending checkout record found for the roll number.');
      }
      else{
        setError('Check-in failed.');
      }
    }
     catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Check-in failed');
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   anchorOrigin: { vertical: 'top', horizontal: 'center' }
      // });
    } finally {
      setLoading(false);
    }
  };

   // Automatically trigger handleCheckIn when qrData changes
   useEffect(() => {
    console.log("Scanned QR Data:", qrData);
    if (qrData.trim() !== '') {
      handleCheckIn(qrData);
    }
  }, [qrData]);

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-bold mb-4">Checkin for Pinkpass</h1>
      
      <div className="flex flex-col items-center">
        <div className="w-full md:w-1/3 mb-4">
          <input 
            type="text" 
            value={qrData} 
            onChange={(e) => setQrData(e.target.value)} 
            placeholder="Scan QR Code" 
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            autoFocus
          />
        </div>

        {/* <button 
          onClick={handleCheckIn}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Processing...' : 'Check-in'}
        </button> */}

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
      </div>
    </div>
  );
};

export default Checkingate;