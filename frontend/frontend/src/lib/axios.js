import axios from 'axios';
 
export const axiosInstance=axios.create({
    baseURL: 'http://localhost:5003',
    withCredentials: true,
})