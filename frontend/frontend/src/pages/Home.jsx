import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4">
        <div className="flex space-x-8 items-center">
          <a href="/" className="text-purple-300 hover:text-white">Home</a>
          <a href="/about" className="text-white hover:text-purple-300">About</a>
          <a href="/classes" className="text-white hover:text-purple-300">Classes</a>
          <a href="/program-list" className="text-white hover:text-purple-300">Program List</a>
          <a href="/plans" className="text-white hover:text-purple-300">Plans</a>
          <a href="/contact" className="text-white hover:text-purple-300">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
            onClick={() => navigate('/membership')}
          >
            Membership
          </button>
          <button 
            className="bg-transparent hover:text-purple-300 flex items-center"
            onClick={handleLogin}
          >
            <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
            Log In
          </button>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex min-h-[80vh] relative">
        <div className="container mx-auto px-4 flex flex-col justify-center z-10 max-w-4xl">
          <h2 className="text-xl mb-2">Body Sync - Functional Fitness Studio</h2>
          <h1 className="text-6xl font-bold mb-12 leading-tight">
            Where Fitness<br />
            Becomes Your<br />
            Lifestyle
          </h1>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded w-40"
            onClick={() => navigate('/booking')}
          >
            Book Now
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-0"></div>
        {/* Background image would be applied via CSS in a real implementation */}
      </div>
    </div>
  );
};

export default Home;

