import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGoalActivityStore from '../store/userGoalsandActivities.js'

const CreateGoal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goal_type: '',
    target_value: ''
  });
  const [success, setSuccess] = useState('');
  
  const { createGoal, loading, error } = useGoalActivityStore();

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', unit: 'kcal' },
    { value: 'running_distance', label: 'Running Distance', unit: 'km' },
    { value: 'exercise_duration', label: 'Exercise Duration', unit: 'hr' },
    { value: 'daily_step', label: 'Daily Step', unit: 'km' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createGoal(formData);
      setSuccess('Goal created successfully!');
      setFormData({ goal_type: '', target_value: '' });
      // Navigate to viewGoals after a short delay to show the success message
      setTimeout(() => navigate('/viewGoals'), 1500);
    } catch (err) {
      // Error is handled by the store
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate('/viewGoals');
  };

  // Get the unit based on selected goal type
  const selectedGoal = goalTypes.find(goal => goal.value === formData.goal_type);
  const unit = selectedGoal ? selectedGoal.unit : '';

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-md mx-auto pt-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Create Your Goal</h2>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-purple-900 border border-purple-700 text-white px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="goal_type">
              Goal Type
            </label>
            <select
              id="goal_type"
              name="goal_type"
              value={formData.goal_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              required
            >
              <option value="">Select a goal type</option>
              {goalTypes.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="target_value">
              Target Value {unit && `(${unit})`}
            </label>
            <input
              type="number"
              id="target_value"
              name="target_value"
              value={formData.target_value}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              min="0.1"
              step="0.1"
              required
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Goal'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoal;