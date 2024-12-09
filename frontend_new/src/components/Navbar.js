import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Math Exercise Platform
          </Link>
          <div className="flex space-x-6">
            <Link to="/exercises" className="text-gray-600 hover:text-gray-800">
              Exercises
            </Link>
            <Link to="/explore-history" className="text-gray-600 hover:text-gray-800">
              History
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-gray-800">
              Leaderboard
            </Link>
            <Link to="/concepts" className="text-gray-600 hover:text-gray-800">
              Concepts
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Log out
            </Link>  
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;