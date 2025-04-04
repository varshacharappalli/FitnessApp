import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useGoalActivityStore from '../store/userGoalsandActivities.js';
import DashboardLayout from '../components/DashboardLayout';

const ViewActivities = () => {
  const { goalId } = useParams();
  const { goals, activities, fetchGoals, fetchActivities, fetchAllActivities, loading, error, updateGoal } = useGoalActivityStore();
  const [goalActivities, setGoalActivities] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (goalId) {
      fetchGoals();
      fetchActivities(goalId);
    } else {
      fetchAllActivities();
    }
  }, [goalId, fetchGoals, fetchActivities, fetchAllActivities]);

  useEffect(() => {
    if (goals.length > 0 && goalId) {
      const goal = goals.find(g => g.goal_id.toString() === goalId);
      if (!goal) {
        console.error("Goal not found");
        navigate('/viewGoals');
        return;
      }
      setSelectedGoal(goal);
      if (!selectedGoal) {
        updateGoal(goalId);
      }
    }
  }, [goals, goalId, updateGoal, navigate]);

  useEffect(() => {
    if (activities.length > 0) {
      setGoalActivities(activities);
    }
  }, [activities]);

  // Goal types mapping for display purposes
  const goalTypeLabels = {
    weight_loss: 'Calories Burnt',
    running_distance: 'Distance',
    exercise_duration: 'Exercise Duration',
    daily_step: 'Daily Steps'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-xl">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (goalId && !selectedGoal) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-xl">Goal not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            {goalId ? 'Activity History' : 'All Activities'}
          </h2>
        </div>

        {goalId && selectedGoal && (
          <div className="bg-gray-800 rounded-lg p-5 mb-6">
            <h3 className="text-xl font-bold mb-2">
              {goalTypeLabels[selectedGoal.goal_type] || selectedGoal.goal_type}
            </h3>
            <p className="mb-1">Target: {selectedGoal.target_value}</p>
            <p>Current Progress: {selectedGoal.current_value || 0}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${Math.min(100, (selectedGoal.current_value / selectedGoal.target_value) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {goalActivities.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-xl">No activities recorded yet.</p>
            {goalId && (
              <Link 
                to={`/create-activity/${goalId}`} 
                className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Record Your First Activity
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Activity Type</th>
                  <th className="px-4 py-3 text-left">Calories</th>
                  <th className="px-4 py-3 text-left">Distance (km)</th>
                  <th className="px-4 py-3 text-left">Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {goalActivities
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((activity) => (
                    <tr key={activity.activity_id} className="border-t border-gray-700">
                      <td className="px-4 py-3">{formatDate(activity.date)}</td>
                      <td className="px-4 py-3">{activity.activity_type}</td>
                      <td className="px-4 py-3">{activity.calories_burnt}</td>
                      <td className="px-4 py-3">{activity.distance}</td>
                      <td className="px-4 py-3">{activity.duration}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewActivities;