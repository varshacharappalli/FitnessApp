import express from 'express';
import { createActivity, createGoal, deleteGoal, updateGoal, viewGoal, viewActivity } from '../controllers/goals&activities.js';

const goalandactivityRoutes = express.Router();

goalandactivityRoutes.post('/createGoal', createGoal);
goalandactivityRoutes.post('/createActivity', createActivity);
goalandactivityRoutes.delete('/deleteGoal', deleteGoal); 
goalandactivityRoutes.get('/viewGoal', viewGoal); 
goalandactivityRoutes.post('/viewActivity', viewActivity); 
goalandactivityRoutes.patch('/updateGoal', updateGoal);

export default goalandactivityRoutes;
