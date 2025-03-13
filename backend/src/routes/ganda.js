import express from 'express';
import { createActivity, createGoal, deleteGoal, updateGoal, viewGoal, viewActivity } from '../controllers/goals&activities.js';

const goalandactivityRoutes = express.Router();

goalandactivityRoutes.post('/createGoal', createGoal);
goalandactivityRoutes.post('/createActivity', createActivity);
goalandactivityRoutes.put('/updateGoal', updateGoal);
goalandactivityRoutes.delete('/deleteGoal', deleteGoal); 
goalandactivityRoutes.get('/viewGoal', viewGoal); 
goalandactivityRoutes.get('/viewActivities', viewActivity); 

export default goalandactivityRoutes;
