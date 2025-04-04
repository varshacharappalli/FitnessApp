import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-400">BodySync</h2>
      </div>
      
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </Link>

        <Link
          to="/create-goal"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
            isActive('/create-goal') ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-xl">🎯</span>
          <span>Create Goal</span>
        </Link>

        <Link
          to="/viewGoals"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
            isActive('/viewGoals') ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-xl">📊</span>
          <span>View Goals</span>
        </Link>

        <Link
          to="/view-activities"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
            isActive('/view-activities') ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-xl">🏃</span>
          <span>View Activities</span>
        </Link>

        <Link
          to="/profile"
          className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
            isActive('/profile') ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span className="text-xl">👤</span>
          <span>User Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 