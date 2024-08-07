import React from 'react';
import '../styles/Navbar.css';
import logo from '../assets/logo.png'; // Make sure you have a logo.png in the specified path

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
    </div>
  );
};

export default Navbar;
