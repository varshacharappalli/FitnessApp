import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGoalActivityStore from '../store/userGoalsandActivities.js';

const CreateActivity = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { goals, fetchGoals, createActivity, updateGoal, loading, error } = useGoalActivityStore();
  
  const [formData, setFormData] = useState({
    goal_id: goalId,
    activity_type: '',
    calories_burnt: '',
    distance: '',
    duration: '',
  });
  const [success, setSuccess] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Fetch goals if not already loaded
  useEffect(() => {
    if (goals.length === 0) {
      fetchGoals();
    }
  }, [goals.length, fetchGoals]);

  // Find the selected goal when goals are loaded
  useEffect(() => {
    if (goals.length > 0 && goalId) {
      const goal = goals.find(g => g.goal_id.toString() === goalId);
      if (goal) {
        setSelectedGoal(goal);
        
        // Set default activity type based on goal type
        let defaultType = '';
        switch(goal.goal_type) {
          case 'kcal':
            defaultType = 'cardio';
            break;
          case 'kms':
            defaultType = 'running';
            break;
          case 'duration':
            defaultType = 'workout';
            break;
          default:
            defaultType = 'cardio';
        }
        
        setFormData(prev => ({ ...prev, activity_type: defaultType }));
      }
    }
  }, [goals, goalId]);

  // Goal types mapping for display purposes
  const goalTypeLabels = {
    kcal: 'Calories Burnt',
    kms: 'Distance',
    duration: 'Exercise Duration'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'goal_id' ? value : 
              ['calories_burnt', 'distance', 'duration'].includes(name) ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make sure all required fields are present
      if (!formData.goal_id || !formData.activity_type || 
          !formData.calories_burnt || !formData.distance || 
          !formData.duration) {
        return;
      }
      
      const success = await createActivity(formData);
      if (success) {
        // Update the goal to reflect the new activity
        await updateGoal({ goal_id: goalId });
        
        setSuccess('Activity recorded successfully!');
        
        // Reset form values except goal_id and activity_type
        setFormData({
          goal_id: goalId,
          activity_type: formData.activity_type,
          calories_burnt: '',
          distance: '',
          duration: ''
        });
        
        // Navigate back to activities view after 2 seconds
        setTimeout(() => {
          navigate(`/view-activities/${goalId}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Error submitting activity:", err);
    }
  };

  if (loading && !selectedGoal) return <div className="text-center py-8 text-white">Loading...</div>;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-md mx-auto pt-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Record Activity</h2>
        
        {selectedGoal && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <p className="font-bold">Goal: {goalTypeLabels[selectedGoal.goal_type] || selectedGoal.goal_type}</p>
            <p>Target: {selectedGoal.target_value}</p>
            <p>Current Progress: {selectedGoal.current_value || 0}</p>
          </div>
        )}
        
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
            <label className="block text-white font-bold mb-2" htmlFor="activity_type">
              Activity Type
            </label>
            <select
              id="activity_type"
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              required
            >
              <option value="">Select activity type</option>
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="yoga">Yoga</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
              <option value="workout">General Workout</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="calories_burnt">
              Calories Burnt
            </label>
            <input
              type="number"
              id="calories_burnt"
              name="calories_burnt"
              value={formData.calories_burnt}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              min="0"
              step="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="distance">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-bold mb-2" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 text-white"
              min="0"
              step="1"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Recording...' : 'Record Activity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;