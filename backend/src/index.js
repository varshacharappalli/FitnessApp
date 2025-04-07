import express from 'express';
import authRoutes from './routes/authRoutes.js'
import connection from './lib/sql.js'
import verifyToken from './middleware/protectedRoute.js';
import { createProfile, getProfile, getUserDetails, updateProfile } from './controllers/profile.controllers.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import goalandactivityRoutes from './routes/goalandactivityRoutes.js';
import cors from 'cors';

dotenv.config({path:'src/.env'});

const app=express();

const PORT=5003;
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth',authRoutes);

// Mount goals and activities routes without verifyToken at router level
app.use('/api', goalandactivityRoutes);

// Profile routes with verifyToken
app.get('/api/profile', verifyToken, getProfile);
app.post('/api/profile', verifyToken, createProfile);
app.put('/api/profile', verifyToken, updateProfile);
app.get('/api/user/details', verifyToken, getUserDetails);

// Test database connection
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
});

app.listen(PORT,()=>{
    console.log("Server is running on port:",PORT);
})