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
        if (!goal_id || !activity_type || !calories_burnt || !distance || !duration) {
            return res.status(400).json({ message: 'All fields must be entered' });
        }

        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'INSERT INTO Activities (user_id, activity_type, calories_burnt, distance, duration, date) VALUES (?, ?, ?, ?, ?, ?)';

        connection.query(query, [user_id, activity_type, calories_burnt, distance, duration, new Date()], (err, results) => {
            if (err) {
                console.error("Insert Error:", err);
                return res.status(500).json({ message: 'Error creating activity' });
            }
            const activity_id = results.insertId;
            const query1 = 'INSERT INTO Acheives (goal_id, activity_id) VALUES (?, ?)';

            connection.query(query1, [goal_id, activity_id], (err) => {
                if (err) {
                    console.error("Insert Error:", err);
                    return res.status(500).json({ message: 'Error linking activity to goal' });
                }
                res.status(200).json({ message: 'Activity created successfully!', activity_id });
            });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const updateGoal = (req, res) => {
    try {
        const { goal_id } = req.body;
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

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
            const validGoalTypes = ['kcal', 'kms', 'duration'];

            if (!validGoalTypes.includes(goal_type)) {
                return res.status(400).json({ message: 'Invalid goal type' });
            }

            const query2 = 'SELECT activity_id FROM Acheives WHERE goal_id = ?';

            connection.query(query2, [goal_id], (err, results) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({ message: 'Error fetching activity IDs' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: 'No activities linked to this goal' });
                }

                const activity_ids = results.map(row => row.activity_id);
                if (activity_ids.length === 0) {
                    return res.status(404).json({ message: 'No activities linked to this goal' });
                }

                let column;
                if (goal_type === 'kcal') {
                    column = 'calories_burnt';
                } else if (goal_type === 'kms') {
                    column = 'distance';
                } else if (goal_type === 'duration') {
                    column = 'duration';
                }

                const query1 = `SELECT SUM(${column}) AS total FROM Activities WHERE activity_id IN (${activity_ids.join(",")})`;
                console.log(activity_ids);

                connection.query(query1, (err, results) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ message: 'Error calculating goal progress' });
                    }

                    const value = results[0].total || 0;
                    const query3 = 'UPDATE Goals SET current_value = ? WHERE goal_id = ?';

                    connection.query(query3, [value, goal_id], (err) => {
                        if (err) {
                            console.log(err.message);
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
                return res.status(404).json({ message: 'No activities found for this goal' });
            }

            const activity_ids = results.map(row => row.activity_id);

            const query1 = `SELECT * FROM Activities WHERE activity_id IN (?) AND user_id=?`;

            connection.query(query1, [activity_ids, user_id], (err, results) => {
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
                return res.status(404).json({ message: 'No goals found' });
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
                    const deleteActivitiesQuery = 'DELETE FROM Activities WHERE activity_id IN (?)';
                    connection.query(deleteActivitiesQuery, [activity_ids], (err) => {
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


