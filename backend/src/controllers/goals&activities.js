import connection from "../lib/sql.js";

export const createGoal = (req, res) => {
    const { goal_type, target_value } = req.body;

    try {
        if (!goal_type || !target_value) {
            return res.status(400).json({ message: 'All fields must be entered' });
        }

        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'INSERT INTO Goals (user_id, goal_type, target_value, current_value, start_date) VALUES (?, ?, ?, ?, ?)';

        connection.query(query, [user_id, goal_type, target_value, 0, new Date()], (err, results) => {
            if (err) {
                console.error("Insert Error:", err);
                return res.status(500).json({ message: 'Error creating goal' });
            }
            res.status(200).json({ message: 'Goal created successfully!', goal_id: results.insertId });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const createActivity = (req, res) => {
    const { goal_id, activity_type, calories_burnt, distance, duration } = req.body;

    try {
        // Validate user input
        if (!goal_id) {
            return res.status(400).json({ message: 'Goal ID is required' });
        }
        if (!activity_type) {
            return res.status(400).json({ message: 'Activity type is required' });
        }
        if (calories_burnt === undefined || calories_burnt === null) {
            return res.status(400).json({ message: 'Calories burnt is required' });
        }
        if (distance === undefined || distance === null) {
            return res.status(400).json({ message: 'Distance is required' });
        }
        if (duration === undefined || duration === null) {
            return res.status(400).json({ message: 'Duration is required' });
        }

        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        // First verify that the goal exists and belongs to the user
        const verifyGoalQuery = 'SELECT goal_id FROM Goals WHERE goal_id = ? AND user_id = ?';
        connection.query(verifyGoalQuery, [goal_id, user_id], (err, results) => {
            if (err) {
                console.error("Error verifying goal:", err);
                return res.status(500).json({ message: 'Error verifying goal ownership' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Goal not found or does not belong to user' });
            }

            // Insert the activity
            const query = 'INSERT INTO Activities (user_id, activity_type, calories_burnt, distance, duration, date) VALUES (?, ?, ?, ?, ?, ?)';

            connection.query(query, [user_id, activity_type, calories_burnt, distance, duration, new Date()], (err, results) => {
                if (err) {
                    console.error("Insert Error (Activity):", err);
                    return res.status(500).json({ 
                        message: 'Error creating activity',
                        details: err.message 
                    });
                }
                const activity_id = results.insertId;

                // Link activity to goal
                const query1 = 'INSERT INTO Acheives (goal_id, activity_id) VALUES (?, ?)';

                connection.query(query1, [goal_id, activity_id], (err) => {
                    if (err) {
                        console.error("Insert Error (Acheives):", err);
                        // If linking fails, we should delete the activity we just created
                        connection.query('DELETE FROM Activities WHERE activity_id = ?', [activity_id], (deleteErr) => {
                            if (deleteErr) {
                                console.error("Error cleaning up activity after failed linking:", deleteErr);
                            }
                        });
                        return res.status(500).json({ 
                            message: 'Error linking activity to goal',
                            details: err.message
                        });
                    }
                    res.status(200).json({ 
                        message: 'Activity created successfully!', 
                        activity_id 
                    });
                });
            });
        });

    } catch (error) {
        console.error("Unexpected error in createActivity:", error);
        return res.status(500).json({ 
            message: 'Server error',
            details: error.message
        });
    }
};

export const updateGoal = (req, res) => {
    try {
        const { goal_id } = req.body;
        const user_id = req.user_id;

        console.log("Received goal_id:", goal_id, "Type:", typeof goal_id);

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        // First, verify the goal exists and get its type
        const query = 'SELECT goal_type FROM Goals WHERE goal_id = ? AND user_id = ?';

        connection.query(query, [goal_id, user_id], (err, results) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ message: 'Error updating goal' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No goal found for user' });
            }

            const goal_type = results[0].goal_type;
            const validGoalTypes = ['weight_loss', 'running_distance', 'exercise_duration', 'daily_step'];

            if (!validGoalTypes.includes(goal_type)) {
                return res.status(400).json({ message: 'Invalid goal type' });
            }

            // Get activity IDs linked to this goal
            const query2 = 'SELECT activity_id FROM Acheives WHERE goal_id = ?';

            connection.query(query2, [goal_id], (err, results) => {
                if (err) {
                    console.log("Error fetching activity IDs:", err.message);
                    return res.status(500).json({ message: 'Error fetching activity IDs' });
                }

                if (results.length === 0) {
                    // If no activities found, set current_value to 0 and return
                    connection.query('UPDATE Goals SET current_value = 0 WHERE goal_id = ?', [goal_id], (err) => {
                        if (err) {
                            console.log("Error updating goal with zero value:", err.message);
                            return res.status(500).json({ message: 'Error updating goal' });
                        }
                        return res.status(200).json({ message: 'Goal updated successfully!', current_value: 0 });
                    });
                    return;
                }

                const activity_ids = results.map(row => row.activity_id);
                console.log("Activity IDs found:", activity_ids);

                // Determine which column to sum based on goal type
                let column;
                if (goal_type === 'weight_loss') {
                    column = 'calories_burnt';
                } else if (goal_type === 'running_distance' || goal_type === 'daily_step') {
                    column = 'distance';
                } else if (goal_type === 'exercise_duration') {
                    column = 'duration';
                }

                // Create placeholders for SQL query
                const placeholders = activity_ids.map(() => '?').join(',');
                const query1 = `SELECT SUM(${column}) AS total FROM Activities WHERE activity_id IN (${placeholders})`;
                console.log("Query:", query1, "Values:", activity_ids);

                connection.query(query1, activity_ids, (err, results) => {
                    if (err) {
                        console.log("Error calculating sum:", err.message);
                        return res.status(500).json({ message: 'Error calculating goal progress' });
                    }

                    const value = results[0].total || 0;
                    console.log("Calculated value:", value);
                    
                    const query3 = 'UPDATE Goals SET current_value = ?, updated_at = ? WHERE goal_id = ?';

                    connection.query(query3, [value, new Date(), goal_id], (err) => {
                        if (err) {
                            console.log("Error updating goal value:", err.message);
                            return res.status(500).json({ message: 'Error updating goal' });
                        }

                        res.status(200).json({ message: 'Goal updated successfully!', current_value: value });
                    });
                });
            });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const viewActivity = (req, res) => {
    try {
        const { goal_id } = req.body;
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'SELECT activity_id FROM Acheives WHERE goal_id=?';

        connection.query(query, [goal_id], (err, results) => {
            if (err) {
                console.error("Error fetching activity IDs:", err);
                return res.status(500).json({ message: 'Error retrieving activities' });
            }

            if (results.length === 0) {
                return res.status(200).json({ activities: [] });
            }

            const activity_ids = results.map(row => row.activity_id);
            
            // Use placeholders for IN clause
            const placeholders = activity_ids.map(() => '?').join(',');
            const query1 = `SELECT * FROM Activities WHERE activity_id IN (${placeholders}) AND user_id=?`;
            
            // Add user_id at the end of the parameters array
            const queryParams = [...activity_ids, user_id];

            connection.query(query1, queryParams, (err, results) => {
                if (err) {
                    console.error("Error fetching activities:", err);
                    return res.status(500).json({ message: 'Error retrieving activities' });
                }

                res.status(200).json({ activities: results });
            });
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const viewGoal = (req, res) => {
    try {
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'SELECT * FROM Goals WHERE user_id = ? ORDER BY start_date DESC';

        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Fetch Error (Goals):", err);
                return res.status(500).json({ message: 'Error retrieving goals' });
            }

            if (results.length === 0) {
                return res.status(200).json({ goals: [] });
            }

            res.status(200).json({ goals: results });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const deleteGoal = (req, res) => {
    try {
        const { goal_id } = req.body;
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }
        const getActivityIdsQuery = 'SELECT activity_id FROM Acheives WHERE goal_id = ?';
        connection.query(getActivityIdsQuery, [goal_id], (err, results) => {
            if (err) {
                console.error("Fetch Error (Activities):", err);
                return res.status(500).json({ message: 'Error fetching activities for deletion' });
            }

            const activity_ids = results.map(row => row.activity_id);

            const deleteAcheivesQuery = 'DELETE FROM Acheives WHERE goal_id = ?';
            connection.query(deleteAcheivesQuery, [goal_id], (err) => {
                if (err) {
                    console.error("Delete Error (Acheives):", err);
                    return res.status(500).json({ message: 'Error deleting goal associations' });
                }

                if (activity_ids.length > 0) {
                    // Use placeholders for IN clause
                    const placeholders = activity_ids.map(() => '?').join(',');
                    const deleteActivitiesQuery = `DELETE FROM Activities WHERE activity_id IN (${placeholders})`;
                    
                    connection.query(deleteActivitiesQuery, activity_ids, (err) => {
                        if (err) {
                            console.error("Delete Error (Activities):", err);
                            return res.status(500).json({ message: 'Error deleting activities' });
                        }
                    });
                }

                const deleteGoalQuery = 'DELETE FROM Goals WHERE goal_id = ? AND user_id = ?';
                connection.query(deleteGoalQuery, [goal_id, user_id], (err) => {
                    if (err) {
                        console.error("Delete Error (Goal):", err);
                        return res.status(500).json({ message: 'Error deleting goal' });
                    }

                    res.status(200).json({ message: 'Goal and linked activities deleted successfully' });
                });
            });
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const viewAllActivities = (req, res) => {
    try {
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'SELECT * FROM Activities WHERE user_id = ? ORDER BY date DESC';

        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Error fetching activities:", err);
                return res.status(500).json({ message: 'Error retrieving activities' });
            }

            res.status(200).json({ activities: results });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};