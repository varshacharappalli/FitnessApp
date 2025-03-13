import express from 'express';
import authRoutes from './routes/authRoutes.js'
import  connection  from './lib/sql.js'
import verifyToken from './middleware/protectedRoute.js';
import { createProfile } from './controllers/profile.controllers.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import goalandactivityRoutes from './routes/ganda.js';
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
app.use('/api/profile',verifyToken,createProfile);
app.use('/api/goals',verifyToken,goalandactivityRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port:",PORT);
})