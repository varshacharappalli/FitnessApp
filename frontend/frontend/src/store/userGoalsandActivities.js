import { create } from 'zustand';
import { axiosInstance } from '../lin/axios.js';

const useGoalActivityStore = create((set, get) => ({
  goals: [],
  activities: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/goals/viewGoal');
      set({ goals: response.data.goals, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching goals',
        loading: false
      });
    }
  },

  fetchActivities: async (goalId) => {
    set({ loading: true, error: null });
    try {
      console.log(goalId);
      const response = await axiosInstance.post('/api/goals/viewActivities', { goal_id: goalId });
      set({ activities: response.data.activities, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error fetching activities',
        loading: false
      });
    }
  },

  createGoal: async (goalData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/goals/createGoal', goalData);
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error creating goal',
        loading: false
      });
      return null;
    }
  },

  createActivity: async (activityData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/api/goals/createActivity', activityData);
      await get().fetchActivities();
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error creating activity',
        loading: false
      });
      return null;
    }
  },

  updateGoal: async (goalData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put('/api/goals/updateGoal', goalData);
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error updating goal',
        loading: false
      });
      return null;
    }
  },

  deleteGoal: async (goal_id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/api/goals/deleteGoal`, {
        data: { goal_id }
      });
      await get().fetchGoals();
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error deleting goal',
        loading: false
      });
      return null;
    }
  },
}));

export default useGoalActivityStore;
