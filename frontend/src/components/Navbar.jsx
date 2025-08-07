// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl sm:text-4xl font-bold text-indigo-700">
          Library
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-medium">Hello, {user.username}!</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
