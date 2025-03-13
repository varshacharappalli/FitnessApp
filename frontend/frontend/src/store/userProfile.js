import { create } from "zustand";
import { axiosInstance } from "../lin/axios";


const useProfileStore = create((set) => ({
    loading: false,
    error: null,

    createProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post("/api/profile", profileData);
            set({ loading: false });
            return response.data; 
        } catch (error) {
            set({ loading: false, error: error.response?.data?.message || "Something went wrong" });
        }
    },
}));

export default useProfileStore;
