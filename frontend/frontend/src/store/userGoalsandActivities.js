import { create } from 'zustand';
import { axiosInstance } from '../lin/axios.js';

const useGoalActivityStore = create((set, get) => ({
  goals: [],
  activities: [],
  loading: false,
  error: null,

  // Goal related actions
  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/goals/viewGoal');
      set({ goals: response.data.goals || [], loading: false });
      return response.data.goals || [];
    } catch (error) {
      console.error("Error fetching goals:", error);
      set({
        error: error.response?.data?.message || 'Error fetching goals',
        loading: false
      });
      return [];
    }
  },

  createGoal: async (goalData) => {
    console.log("Sending goal data:", goalData);  // Debugging
  
    set({ loading: true, error: null });
    try {
      const response=axiosInstance.post("api/goals/createGoal", goalData, {
        headers: { "Content-Type": "application/json" }
      })
      .then(response => console.log("Goal created:", response.data))
      .catch(error => console.error("Error creating goal:", error.response?.data || error.message));
      
  
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error creating goal:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || 'Error creating goal',
        loading: false
      });
      return null;
    }
  }
  ,

  updateGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      console.log("Updating goal with ID:", goalId);
      // Backend expects just goal_id for updating
      const response = await axiosInstance.patch('/api/goals/updateGoal', { 
        goal_id: goalId 
      });
      
      console.log("Goal update response:", response.data);
      
      // Refresh goals after update
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error updating goal:", error);
      set({
        error: error.response?.data?.message || 'Error updating goal',
        loading: false
      });
      return null;
    }
  },

  deleteGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete('/api/goals/deleteGoal', {
        data: { goal_id: goalId }
      });
      
      // Refresh goals after deletion
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error deleting goal:", error);
      set({
        error: error.response?.data?.message || 'Error deleting goal',
        loading: false
      });
      return null;
    }
  },

  // Activity related actions
  fetchActivities: async (goalId) => {
    set({ loading: true, error: null });
    try {
      console.log("Fetching activities for goal ID:", goalId);
      const response = await axiosInstance.post('/api/goals/viewActivity', { 
        goal_id: goalId 
      });
      
      console.log("Activities fetched:", response.data.activities);
      set({ 
        activities: response.data.activities || [], 
        loading: false 
      });
      return response.data.activities || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      set({
        error: error.response?.data?.message || 'Error fetching activities',
        loading: false
      });
      return [];
    }
  },

  createActivity: async (activityData) => {
    set({ loading: true, error: null });
    try {
      console.log("Creating activity with data:", {
        goal_id: activityData.goalId,
        activity_type: activityData.activityType,
        calories_burnt: activityData.caloriesBurnt,
        distance: activityData.distance,
        duration: activityData.duration
      });
      
      // Backend expects goal_id, activity_type, calories_burnt, distance, duration
      const response = await axiosInstance.post('/api/goals/createActivity', {
        goal_id: activityData.goalId,
        activity_type: activityData.activityType,
        calories_burnt: activityData.caloriesBurnt,
        distance: activityData.distance,
        duration: activityData.duration
      });
      
      console.log("Activity creation response:", response.data);
      
      // After creating an activity, update the goal and refresh activities
      if (response.data) {
        console.log("Updating goal after activity creation");
        await get().updateGoal(activityData.goalId);
        await get().fetchActivities(activityData.goalId);
      }
      
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error);
      set({
        error: error.response?.data?.message || 'Error creating activity',
        loading: false
      });
      return null;
    }
  }
}));

export default useGoalActivityStore;