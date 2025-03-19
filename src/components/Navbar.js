import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Navbar.css';
import {
  FaCaretDown,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaUserPlus,
  FaUserEdit,
  FaFingerprint,
  FaDatabase,
  FaClipboardList,
  FaUserCheck,
  FaSignOutAlt,
  FaTachometerAlt,
  FaIdCard,
  FaListAlt,
  FaUsers,
  FaImage,
  FaCheckCircle,
  FaFileAlt,
  FaUserGraduate,
} from 'react-icons/fa';
import { useSnackbar } from 'notistack';

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track the active dropdown

  const dropdownRef = useRef(null);
  const menuRef = useRef(null); // Add this line

  const handleDashboardClick = () => {
    navigate('/dashboard');
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://82.29.162.24:3300/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies)
      });

      if (response.ok) {
        enqueueSnackbar('Logout successful', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: 3000,
        });
        navigate('/login'); // Redirect to login page
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      enqueueSnackbar('Error during logout', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        autoHideDuration: 3000,
      });
      console.error('Error during logout:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev); // Toggle mobile menu
    setActiveDropdown(null); // Reset dropdowns when toggling the menu
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null); // Close dropdowns when the menu is closed
  };

  const toggleDropdown = (dropdown) => {
    // If the clicked dropdown is already active, close it
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      // Otherwise, set the clicked dropdown as active
      setActiveDropdown(dropdown);
    }
  };

  const handleMenuItemClick = () => {
    closeMobileMenu();
  };

  const handleSubMenuItemClick = () => {
    closeMobileMenu();
    setActiveDropdown(null); // Close dropdown after clicking a sub-item
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdown(null); // Close dropdown when clicking outside
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMobileMenu(); // Close the mobile menu if clicked outside
      }
    };

    // Add event listener when the mobile menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]); // Re-run effect when isMobileMenuOpen changes

  return (
    <div ref={dropdownRef}>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Hamburger Menu Icon */}
          <div className="menu-icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>

          {/* Nav Menu */}
          <ul ref={menuRef} className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            {username === 'admin' && (
              <li className="dropdown">
                <span
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleDropdown('registration')}
                >
                  <FaUserPlus className="mr-2" /> Registration <FaCaretDown className="ml-1" />
                </span>
                <div className={`dropdown-content ${activeDropdown === 'registration' ? 'active' : ''}`}>
                  <Link to="/registration/singleUser" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaUserPlus className="mr-2" /> Add User
                  </Link>
                  <Link to="/registration/updateUser" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaUserEdit className="mr-2" /> Update/Delete
                  </Link>
                  <Link to="/registration/addFingerprint" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaFingerprint className="mr-2" /> Add Fingerprint
                  </Link>
                  <Link to="/registration/updateFingerprint" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaFingerprint className="mr-2" /> Update Fingerprint
                  </Link>
                  <Link to="/registration/moreUsers" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaUsers className="mr-2" /> Bulk Users
                  </Link>
                  <Link to="/registration/moreImages" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaImage className="mr-2" /> Student Images
                  </Link>
                </div>
              </li>
            )}
            {username === 'admin' && (
              <li>
                <Link to="/dashboard" onClick={handleMenuItemClick}>
                  <span className="flex items-center">
                    <FaTachometerAlt className="mr-2" /> Dashboard
                  </span>
                </Link>
              </li>
            )}
            {username === 'admin' && (
              <li className="dropdown">
                <span
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleDropdown('checkout')}
                >
                  <FaCheckCircle className="mr-2" /> CheckOut <FaCaretDown className="ml-1" />
                </span>
                <div className={`dropdown-content ${activeDropdown === 'checkout' ? 'active' : ''}`}>
                  <Link to="/AdminPass" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaIdCard className="mr-2" /> PinkPass
                  </Link>
                  <Link to="/Adminoutpass" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaClipboardList className="mr-2" /> OutPass
                  </Link>
                </div>
              </li>
            )}
            {username === 'guard' && (
              <li className="dropdown">
                <span
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleDropdown('checkout')}
                >
                  <FaCheckCircle className="mr-2" /> CheckOut <FaCaretDown className="ml-1" />
                </span>
                <div className={`dropdown-content ${activeDropdown === 'checkout' ? 'active' : ''}`}>
                  <Link to="/Pass" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaIdCard className="mr-2" /> PinkPass
                  </Link>
                  <Link to="/outpass" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                    <FaClipboardList className="mr-2" /> OutPass
                  </Link>
                </div>
              </li>
            )}
            <li className="dropdown">
              <span
                className="flex items-center cursor-pointer"
                onClick={() => toggleDropdown('checkin')}
              >
                <FaUserCheck className="mr-2" /> CheckIn <FaCaretDown className="ml-1" />
              </span>
              <div className={`dropdown-content ${activeDropdown === 'checkin' ? 'active' : ''}`}>
                <Link to="/checkingate" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                  <FaIdCard className="mr-2" /> Pinkpass
                </Link>
                <Link to="/checkinout" onClick={handleSubMenuItemClick} style={{ fontSize: '13px' }}>
                  <FaClipboardList className="mr-2" /> Outpass
                </Link>
              </div>
            </li>
            <li>
              <Link to="/reports" onClick={handleMenuItemClick}>
                <span className="flex items-center">
                  <FaFileAlt className="mr-2" /> Reports
                </span>
              </Link>
            </li>
            <li>
              <Link to="/student-details" onClick={handleMenuItemClick}>
                <span className="flex items-center">
                  <FaUserGraduate className="mr-2" /> Student Details
                </span>
              </Link>
            </li>
            {username === 'admin' && (
  <li>
    <Link to="/settings/holiday" onClick={handleMenuItemClick}>
      <span className='flex items-center'>Settings</span>
    </Link>
  </li>
)}
            <li className="logout-button">
              <button onClick={handleLogout} className="logout-btn">
                <span className="flex items-center justify-center">
                  <FaSignOutAlt className="mr-2" /> Logout <FaArrowRight className="ml-1" />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;