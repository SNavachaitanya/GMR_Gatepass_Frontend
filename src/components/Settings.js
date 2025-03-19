import React from 'react';
import { useSnackbar } from 'notistack';

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleDeclareHoliday = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
  
    console.log('Formatted Date (Local):', formattedDate); // Log the formatted date
  
    try {
      const response = await fetch('http://82.29.162.24:3300/declare-holiday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: formattedDate }),
      });
  
      console.log('Response:', response); // Log the response
  
      const data = await response.json();
      console.log('Response Data:', data); // Log the response data
  
      if (response.ok) {
        enqueueSnackbar('Declared holiday', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
      } else {
        // Handle duplicate date error
        if (data.error && data.error.includes('already declared')) {
          enqueueSnackbar('This date is already declared as a holiday', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
            autoHideDuration: 3000,
          });
        } else {
          throw new Error(data.error || 'Failed to declare holiday');
        }
      }
    } catch (error) {
      console.error('Error:', error); // Log the error
      enqueueSnackbar(error.message || 'Error declaring holiday', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: 'url(/path/to/your/background-image.jpg)', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
      >
        <button
          onClick={handleDeclareHoliday}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Declare Today as Holiday
        </button>
      </div>
    </div>
  );
};

export default Settings;