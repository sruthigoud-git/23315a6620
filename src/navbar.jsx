// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Stock Aggregator</h1>
      <div className="links">
        <Link to="/stocks">Stock Prices</Link>
        <Link to="/heatmap">Correlation Heatmap</Link>
      </div>
    </nav>
  );
}

export default Navbar;