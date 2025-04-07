import express from "express";
import connection from "../lib/sql.js";
import verifyToken from "../middleware/protectedRoute.js";
import { createGoal, createActivity, updateGoal, viewGoal, viewActivity, deleteGoal, viewAllActivities } from '../controllers/goals&activities.js';

const router = express.Router();

// Goals routes
router.get("/goals/viewGoal", verifyToken, viewGoal);
router.post("/goals/createGoal", verifyToken, createGoal);
router.post("/goals/updateGoal", verifyToken, updateGoal);
router.delete("/goals/deleteGoal", verifyToken, deleteGoal);

// Activities routes
router.post("/goals/viewActivity", verifyToken, viewActivity);
router.get("/goals/allActivities", verifyToken, viewAllActivities);
router.post("/goals/createActivity", verifyToken, createActivity);

export default router; 