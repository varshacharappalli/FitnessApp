import React from 'react';
import { Activity, TrendingUp, Target, Calendar, CheckCircle } from 'lucide-react';

const WeeklyReport = ({ activities, goals }) => {
  // Calculate weekly statistics
  const calculateWeeklyStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    console.log("Current date:", now);
    console.log("One week ago:", oneWeekAgo);
    console.log("All activities:", activities);
    
    const weeklyActivities = activities.filter(activity => {
      // Parse the date string properly
      // MySQL date format is typically 'YYYY-MM-DD'
      const [year, month, day] = activity.date.split('-').map(Number);
      // JavaScript months are 0-indexed, so subtract 1 from month
      const activityDate = new Date(year, month - 1, day);
      
      console.log("Activity date string:", activity.date);
      console.log("Parsed activity date:", activityDate);
      
      return activityDate >= oneWeekAgo;
    });

    console.log("Weekly activities:", weeklyActivities);
    
    const totalCalories = weeklyActivities.reduce((sum, activity) => {
      console.log("Activity:", activity);
      console.log("Activity calories:", activity.calories_burnt, "Type:", typeof activity.calories_burnt);
      // Parse the calories_burnt value to ensure it's a number
      const calories = parseFloat(activity.calories_burnt) || 0;
      console.log("Parsed calories:", calories);
      return sum + calories;
    }, 0);

    const totalDistance = weeklyActivities.reduce((sum, activity) => 
      sum + (activity.distance || 0), 0
    );

    // Convert duration from HH:MM:SS format to minutes
    const totalDuration = weeklyActivities.reduce((sum, activity) => {
      if (!activity.duration) return sum;
      
      const [hours, minutes] = activity.duration.split(':').map(Number);
      return sum + (hours * 60 + minutes);
    }, 0);

    console.log("Total calories calculated:", totalCalories);

    return {
      totalActivities: weeklyActivities.length,
      totalCalories,
      totalDistance,
      totalDuration
    };
  };

  const stats = calculateWeeklyStats();

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="mr-2 text-purple-500" />
          Weekly Progress Report
        </h2>
        <span className="text-gray-400 text-sm">
          Last 7 days
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Activities Card */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-purple-500" />
            <span className="text-gray-400 text-sm">Activities</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalActivities}</p>
          <p className="text-gray-400 text-sm">This Week</p>
        </div>

        {/* Calories Burned Card */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-purple-500" />
            <span className="text-gray-400 text-sm">Calories</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalCalories}</p>
          <p className="text-gray-400 text-sm">kcal Burned</p>
        </div>

        {/* Distance Card */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="text-purple-500" />
            <span className="text-gray-400 text-sm">Distance</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalDistance.toFixed(1)}</p>
          <p className="text-gray-400 text-sm">km Covered</p>
        </div>

        {/* Duration Card */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-purple-500" />
            <span className="text-gray-400 text-sm">Duration</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalDuration}</p>
          <p className="text-gray-400 text-sm">Minutes Active</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        {goals
          .filter(goal => goal.current_value < goal.target_value)
          .map(goal => {
            return (
              <div key={goal.goal_id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium flex items-center">
                    {goal.goal_type}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {goal.current_value} / {goal.target_value}
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        
        {goals.filter(goal => goal.current_value < goal.target_value).length === 0 && (
          <div className="text-center py-4 bg-gray-700 rounded-lg">
            <p className="text-white">All your goals have been completed! 🎉</p>
          </div>
        )}
      </div>

      {/* Completed Goals Section */}
      {goals.filter(goal => goal.current_value >= goal.target_value).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Completed Goals</h3>
          <div className="space-y-4">
            {goals
              .filter(goal => goal.current_value >= goal.target_value)
              .map(goal => (
                <div key={goal.goal_id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium flex items-center">
                      {goal.goal_type} - Completed
                      <CheckCircle className="ml-2 text-green-500" size={18} />
                    </span>
                    <span className="text-gray-400 text-sm">
                      {goal.current_value} / {goal.target_value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport; 