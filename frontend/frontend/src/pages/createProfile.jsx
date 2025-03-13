import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfileStore from '../store/userProfile';

const CreateProfile = () => {
  const navigate = useNavigate();
  const { createProfile, loading, error } = useProfileStore();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    difficulty_level: 'Beginner'
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await createProfile(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      // Error is already handled in the store
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center">Create Your Fitness Profile</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded mb-4">
            Profile created successfully! Redirecting to dashboard...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Height (cm)</label>
            <input 
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
              min="100"
              max="250"
              step="0.1"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Weight (kg)</label>
            <input 
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
              min="30"
              max="300"
              step="0.1"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Fitness Level</label>
            <select
              name="difficulty_level"
              value={formData.difficulty_level}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="mt-8">
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-medium"
              disabled={loading}
            >
              {loading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;