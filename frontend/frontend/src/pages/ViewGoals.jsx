import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGoalActivityStore from '../store/userGoalsandActivities.js';
import DashboardLayout from '../components/DashboardLayout';

const ViewGoals = () => {
  const { goals, loading, error, fetchGoals, deleteGoal } = useGoalActivityStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId);
    }
  };

  const handleCreateActivity = (goalId) => {
    navigate(`/create-activity/${goalId}`);
  };

  // Goal types mapping for display purposes
  const goalTypeLabels = {
    weight_loss: 'Weight Loss',
    running_distance: 'Running Distance',
    exercise_duration: 'Exercise Duration',
    daily_step: 'Daily Step'
  };

  // Units mapping based on goal type
  const goalTypeUnits = {
    weight_loss: 'kcal',
    running_distance: 'km',
    exercise_duration: 'hr',
    daily_step: 'km'
  };

  if (loading) return <div className="text-center py-8 text-white">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Goals</h2>
          <Link 
            to="/create-goal" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Goal
          </Link>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-xl">You don't have any goals yet.</p>
            <Link 
              to="/create-goal" 
              className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Your First Goal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.goal_id} className="bg-gray-800 rounded-lg p-6 relative">
                <h3 className="text-xl font-bold mb-3">{goalTypeLabels[goal.goal_type] || goal.goal_type}</h3>
                <p className="mb-2">Target: {goal.target_value} {goalTypeUnits[goal.goal_type]}</p>
                <p className="mb-4">Current Progress: {goal.current_value || 0} {goalTypeUnits[goal.goal_type]}</p>
                
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => handleDeleteGoal(goal.goal_id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                  
                  <button
                    onClick={() => handleCreateActivity(goal.goal_id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full text-xl absolute top-4 right-4"
                    title="Add Activity"
                  >
                    +
                  </button>
                </div>

                <Link
                  to={`/view-activities/${goal.goal_id}`}
                  className="mt-4 text-purple-400 hover:text-purple-300 block"
                >
                  View Activities →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewGoals;