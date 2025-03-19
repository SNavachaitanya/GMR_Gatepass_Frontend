import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import logo from '../assets/logo.jpg';
import backgroundImage from '../assets/background.jpg';
import { useSnackbar } from 'notistack';
import { FaUser , FaLock } from 'react-icons/fa'; // Import icons

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://82.29.162.24:3300/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the token in cookies and show success message
        Cookies.set('token', result.token, { expires: 1 / 24 });
        enqueueSnackbar('Login Successful!', { variant: 'success' });
        setTimeout(() => {
          window.location.href = '/'; // Redirect after success message
        }, 1500); // Delay redirection to allow time for Snackbar display
      } else {
        enqueueSnackbar(result.message || 'Login Failed', { variant: 'error' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      enqueueSnackbar('Failed to log in', { variant: 'error' });
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900">
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="relative z-10 w-full max-w-md p-8 space-y-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
          borderRadius: '20px', // Rounded corners
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)', // Shadow for depth
          backdropFilter: 'blur(10px)', // Blur effect for background
        }}
      >
        <div className="flex justify-center mb-4">
          <img className="w-22 h-10" src={logo} alt="logo" />
        </div>
        <h1 className="text-xl font-bold text-center text-white">Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="relative">
            <FaUser  className="absolute left-3 top-3 text-gray-400" />
            <label htmlFor="username" className="sr-only">Admin Name</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-primary-600 focus:border-primary-600"
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 p-2 border border-gray-300 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-primary-600 focus:border-primary-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white font-bold bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg text-sm px-5 py-2.5 text-center"
            style={{
              transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth transition
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Submit
          </button>
          {error && (
            <p className="text-sm font-light text-red-500 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;