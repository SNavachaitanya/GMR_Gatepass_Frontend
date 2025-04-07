import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Checkinout = () => {
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Function to parse QR code data
  const parseQRData = (data) => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  };

  // Function to send SMS
  const sendSMS = async (message) => {
    try {
      const response = await axios.post('http://82.29.162.24/send-sms-in', {
        message: message,
      });
      if (response.data.success) {
        console.log('SMS sent successfully!');
        enqueueSnackbar('SMS Sent Successfully!', { variant: 'success' });
      } else {
        console.error('Failed to send SMS:', response.data.message);
        enqueueSnackbar('SMS not Sent!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

  // Function to handle check-in
  const handleCheckIn = async (qrData) => {
    setMessage('');
    setError('');
    
    const parsedData = parseQRData(qrData);
    
    if (!parsedData || !parsedData.studentID || !parsedData.token) {
      setError('Invalid QR code format. Please scan a valid QR code.');
      enqueueSnackbar('Invalid QR code format. Please scan a valid QR code.', {
        variant: 'warning',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        autoHideDuration: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`http://82.29.162.24/checkin-out/${parsedData.studentID}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: parsedData.token }),
      });

      if (response.ok) {
        const data = await response.json();
        // sendSMS(data.parentno); // Uncomment to send SMS to parent
        setMessage('Check-in successful!');
        enqueueSnackbar('Check-in successful!', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
        setError('');
        setQrData(''); // Clear the input field after successful check-in
      } else if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid or expired QR code.');
        enqueueSnackbar(errorData.message || 'Invalid or expired QR code.', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
      } else if (response.status === 404) {
        setError('No pending checkout record found for this student.');
        enqueueSnackbar('No pending checkout record found for this student.', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
      } else {
        setError('Check-in failed.');
        enqueueSnackbar('Check-in failed.', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      console.error('Error during check-in:', err);
      setError('Server error occurred during check-in.');
      enqueueSnackbar('Server error occurred during check-in.', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        autoHideDuration: 3000,
      });
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
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 className="text-center text-2xl font-bold">Check-in for Outpass</h1>

      {/* Input field for QR code scanning */}
      <input
        type="text"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
        placeholder="Scan QR Code"
        className="border rounded w-full md:w-1/3 px-3 py-2 mx-auto mb-4 block mobile-padding"
        autoFocus // Automatically focus on the input field
      />

      {/* Display error or success message */}
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
      {message && (
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            backgroundColor: 'green',
            opacity: 0.7,
            fontWeight: 'bold',
            fontSize: 'px',
            padding: '8px',
            borderRadius: '9px',
            margin: '10px auto',
            maxWidth: '400px',
          }}
        >
          {message}
        </p>
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
            margin-left: 15px;
            margin-right: 15px;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkinout;