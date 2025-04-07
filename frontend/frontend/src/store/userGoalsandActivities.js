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
      // Extract the ID if an object was passed
      const id = typeof goalId === 'object' ? goalId.goal_id : goalId;
      
      console.log("Updating goal with ID:", id);
      
      // Make sure we have a valid ID
      if (!id) {
        throw new Error('Invalid goal ID');
      }
      
      const response = await axiosInstance.post('/api/goals/updateGoal', { 
        goal_id: id 
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Rest of your function remains the same
      console.log("Goal update response:", response.data);
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error updating goal:", error);
      set({
        error: error.response?.data?.message || 'Error updating goal',
        loading: false
      });
      throw error;
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
  fetchAllActivities: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/goals/allActivities');
      console.log("All activities fetched:", response.data);
      console.log("Activities array:", response.data.activities);
      if (response.data.activities && response.data.activities.length > 0) {
        console.log("Sample activity (first one):", response.data.activities[0]);
        console.log("Sample activity calories_burnt:", response.data.activities[0].calories_burnt);
      }
      
      if (!response.data || !response.data.activities) {
        console.warn("No activities data in response:", response.data);
        set({ activities: [], loading: false });
        return [];
      }
      
      set({ 
        activities: response.data.activities, 
        loading: false 
      });
      return response.data.activities;
    } catch (error) {
      console.error("Error fetching all activities:", error);
      set({
        error: error.response?.data?.message || 'Error fetching activities',
        loading: false
      });
      return [];
    }
  },

  fetchActivities: async (goalId) => {
    set({ loading: true, error: null });
    try {
      console.log("Fetching activities for goal ID:", goalId);
      const response = await axiosInstance.post('/api/goals/viewActivity', { 
        goal_id: goalId 
      });
      
      console.log("Activities fetched:", response.data);
      
      if (!response.data || !response.data.activities) {
        console.warn("No activities data in response:", response.data);
        set({ activities: [], loading: false });
        return [];
      }
      
      set({ 
        activities: response.data.activities, 
        loading: false 
      });
      return response.data.activities;
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
      console.log("Creating activity with data:", activityData);
      
      const response = await axiosInstance.post('/api/goals/createActivity', activityData);
      
      console.log("Activity creation response:", response.data);
      
      // Always update the goal and refresh activities after successful activity creation
      console.log("Updating goal after activity creation");
      await get().updateGoal(activityData.goal_id);
      await get().fetchActivities(activityData.goal_id);
      
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Error creating activity:", error);
      set({
        error: error.response?.data?.message || 'Error creating activity',
        loading: false
      });
      throw error; // Re-throw the error so the component can handle it
    }
  }
}));

export default useGoalActivityStore;