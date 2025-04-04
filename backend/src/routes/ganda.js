import express from 'express';
import { createActivity, createGoal, deleteGoal, updateGoal, viewGoal, viewActivity, viewAllActivities } from '../controllers/goals&activities.js';

const goalandactivityRoutes = express.Router();

goalandactivityRoutes.post('/createGoal', createGoal);
goalandactivityRoutes.post('/createActivity', createActivity);
goalandactivityRoutes.delete('/deleteGoal', deleteGoal); 
goalandactivityRoutes.get('/viewGoal', viewGoal); 
goalandactivityRoutes.post('/viewActivity', viewActivity); 
goalandactivityRoutes.post('/updateGoal', updateGoal);
goalandactivityRoutes.get('/allActivities', viewAllActivities);

export default goalandactivityRoutes;