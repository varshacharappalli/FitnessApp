import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserAuth from '../store/userAuth.js';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading, error,isAuthenticated } = useUserAuth();
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

    if (formData.password.length < 6) {
      return;
    }

    await signUp(formData);
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
              <input 
                type="text" 
                id="first_name"
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                placeholder="John" 
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
                required 
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
              <input 
                type="text" 
                id="last_name"
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                placeholder="Doe" 
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
                required 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              id="username"
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="johndoe123" 
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
              required 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••" 
              minLength="6"
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
              required 
            />
            <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of Birth</label>
              <input 
                type="date" 
                id="dob"
                name="dob" 
                value={formData.dob} 
                onChange={handleChange} 
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
                required 
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
              <input 
                type="number" 
                id="age"
                name="age" 
                value={formData.age} 
                onChange={handleChange} 
                min="16" 
                max="120"
                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
                required 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
            <select 
              id="gender"
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email Address{formData.emails.length > 1 ? 'es' : ''}</label>
            {formData.emails.map((email, index) => (
              <div key={index} className="flex items-center mb-2">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => handleEmailChange(index, e.target.value)} 
                  placeholder="youremail@example.com"
                  className="flex-grow bg-gray-800 rounded-l border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => removeEmailField(index)} 
                  disabled={formData.emails.length <= 1}
                  className={`px-3 py-2 bg-red-700 text-white rounded-r ${formData.emails.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-800'}`}
                >
                  <span className="font-bold">-</span>
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addEmailField}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              <span className="font-bold text-lg mr-1">+</span> Add another email
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {isAuthenticated && (
            
            navigate('/createProfile')
)}
        </form>
        
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/signin')}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;