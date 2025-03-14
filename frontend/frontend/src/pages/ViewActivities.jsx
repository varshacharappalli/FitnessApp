import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGoalActivityStore from '../store/userGoalsandActivities.js';

const ViewActivities = () => {
  const { goalId } = useParams();
  const { goals, activities, fetchGoals, fetchActivities, loading, error } = useGoalActivityStore();
  const [goalActivities, setGoalActivities] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
    fetchActivities(goalId); // Pass goalId if your fetchActivities can filter by goal
  }, [goalId, fetchGoals, fetchActivities]);

  useEffect(() => {
    // Find the selected goal when goals are loaded
    if (goals.length > 0 && goalId) {
      const goal = goals.find(g => g.goal_id.toString() === goalId);
      setSelectedGoal(goal);
    }
  }, [goals, goalId]);

  useEffect(() => {
    // Filter activities for the current goal
    // Assuming activities are already filtered by the backend
    if (activities.length > 0) {
      setGoalActivities(activities);
    }
  }, [activities]);

  // Goal types mapping for display purposes
  const goalTypeLabels = {
    kcal: 'Calories Burnt',
    kms: 'Distance',
    duration: 'Exercise Duration'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && (!selectedGoal)) {
    return <div className="text-center py-8 text-white">Loading...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Activities</h2>
          <div>
            <Link 
              to={`/create-activity/${goalId}`} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Add Activity
            </Link>
            <Link 
              to="/goals" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Goals
            </Link>
          </div>
        </div>

        {selectedGoal && (
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
            <p className="text-xl">No activities recorded for this goal yet.</p>
            <Link 
              to={`/create-activity/${goalId}`} 
              className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Record Your First Activity
            </Link>
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
    </div>
  );
};

export default ViewActivities;