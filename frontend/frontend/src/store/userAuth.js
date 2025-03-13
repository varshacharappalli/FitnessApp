import { create } from 'zustand';
import {axiosInstance} from '../lin/axios.js'

const useUserAuth = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    signUp: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/signup', userData);
            set({ user: response.data.user, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signup failed', loading: false });
        }
    },

    signIn: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/signin', credentials);
            set({ user: response.data.user, isAuthenticated: true, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signin failed', loading: false });
        }
    },

    logOut: async () => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null, isAuthenticated: false, loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Logout failed', loading: false });
        }
    },

    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/auth/check');
            set({ user: response.data.user, isAuthenticated: true, loading: false });
        } catch {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    }
}));

export default useUserAuth;
