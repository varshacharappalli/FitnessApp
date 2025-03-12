import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    dob: '',
    age: '',
    gender: 'Male',
    emails: ['']
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = value;
    setFormData({ ...formData, emails: updatedEmails });
  };

  const addEmailField = () => {
    setFormData({ ...formData, emails: [...formData.emails, ''] });
  };

  const removeEmailField = (index) => {
    if (formData.emails.length > 1) {
      const updatedEmails = formData.emails.filter((_, i) => i !== index);
      setFormData({ ...formData, emails: updatedEmails });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', formData);
      console.log(response.data);
      navigate('/signin');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center">Join Body Sync</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">First Name</label>
              <input 
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Last Name</label>
              <input 
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

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
              minLength="6"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Date of Birth</label>
              <input 
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Age</label>
              <input 
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
                min="16"
                max="120"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Email Addresses</label>
            {formData.emails.map((email, index) => (
              <div key={index} className="flex mb-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="w-full p-3 rounded-l bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 rounded-r"
                  disabled={formData.emails.length <= 1}
                >
                  -
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={addEmailField}
              className="mt-1 text-purple-400 hover:text-purple-300 text-sm"
            >
              + Add another email
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-medium mt-6"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">Already have an account?</p>
          <button 
            onClick={() => navigate('/signin')}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;