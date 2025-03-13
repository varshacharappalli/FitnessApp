import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserAuth from '../store/userAuth.js';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, error, loading,isAuthenticated} = useUserAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn({
      username: formData.username,
      password: formData.password
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-purple-400 hover:text-purple-300 text-sm"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-medium"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {isAuthenticated && (
            navigate('/dashboard')
)}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">Don't have an account?</p>
          <button
            onClick={() => navigate('/signup')}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Create Account
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;