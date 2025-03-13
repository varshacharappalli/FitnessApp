import connection from "../lib/sql.js";

export const createGoal = (req, res) => {
    const { goal_type, target_value } = req.body;

    try {
        if (!goal_type || !target_value) {
            return res.status(400).json({ message: 'All fields must be entered' });
        }

        const user_id = req.user_id;

        if(!user_id){
            return res.status(400).json({ message: 'User id isnt present' });
        }

        const query = 'INSERT INTO Goals (user_id, goal_type, target_value, current_value) VALUES (?, ?, ?, ?)';
        
        connection.query(query, [user_id, goal_type, target_value, 0], (err, results) => {
            if (err) {
                console.error("Insert Error:", err);
                return res.status(500).json({ message: 'Error creating goal' });
            }

            const goal_id = results.insertId;
            const query1 = 'UPDATE Goals SET start_date = ? WHERE goal_id = ?';

            connection.query(query1, [new Date(), goal_id], (err, results) => {
                if (err) {
                    console.error("Update Error:", err);
                    return res.status(500).json({ message: 'Error updating start date' });
                }

                res.status(200).json({ message: 'Goal created successfully!' });
            });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const createActivity=(req,res)=>{
    const{goal_id,activity_type,calories_burnt,distance,duration}=req.body;
    try {
        if(!goal_id||!activity_type||!calories_burnt||!distance||!duration){
            return res.status(400).json({ message: 'All fields must be entered' });
        }

        const user_id = req.user_id;

        if(!user_id){
            return res.status(400).json({ message: 'User id isnt present' });
        }

        const query='INSERT INTO Activities(user_id,activity_type,calories_burnt,distance,duration,date) VALUES(?,?,?,?,?,?)';

        connection.query(query,[user_id,activity_type,calories_burnt,distance,duration,new Date()],(err,results)=>{
            if (err) {
                console.error("Insert Error:", err);
                return res.status(500).json({ message: 'Error creating goal' });
            }
            const activity_id=results.insertId;
            const query1='INSERT INTO ACHEIVES(goal_id,activity_id) VALUES(?,?)';
            connection.query(query1,[goal_id,activity_id],(err,results)=>{
                if (err) {
                    console.error("Insert Error:", err);
                    return res.status(500).json({ message: 'Error creating goal' });
                }
                res.status(200).json({ message: 'Activity created successfully!' });
            })
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
    
}

export const updateGoal = (req, res) => {
    try {
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User id isn\'t present' });
        }

        const query = 'SELECT goal_type FROM Goals WHERE user_id = ?';
        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ message: 'Error updating Goal' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No goal found for user' });
            }

            const goal_type = results[0].goal_type;
            let query1;

            if (goal_type === 'kcal') {
                query1 = 'SELECT SUM(calories_burnt) AS total FROM Activities WHERE user_id = ?';
            } else if (goal_type === 'kms') {
                query1 = 'SELECT SUM(distance) AS total FROM Activities WHERE user_id = ?';
            } else if (goal_type === 'duration') {
                query1 = 'SELECT SUM(duration) AS total FROM Activities WHERE user_id = ?';
            } else {
                return res.status(400).json({ message: 'Invalid goal type' });
            }

            connection.query(query1, [user_id], (err, results) => {
                if (err) {
                    console.log(err.message);
                    return res.status(500).json({ message: 'Error updating goal' });
                }

                const value = results[0].total || 0;
                const query2 = 'UPDATE Goals SET current_value = ? WHERE user_id = ?';

                connection.query(query2, [value, user_id], (err, results) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(500).json({ message: 'Error updating goal' });
                    }

                    res.status(200).json({ message: 'Goal updated successfully!', current_value: value });
                });
            });
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const deleteGoal = (req, res) => {
    const { goal_id } = req.body;

    try {
        if (!goal_id) {
            return res.status(400).json({ message: 'Goal ID is required' });
        }

        const user_id = req.user_id;
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const deleteAchievesQuery = 'DELETE FROM ACHEIVES WHERE goal_id = ?';

        connection.query(deleteAchievesQuery, [goal_id], (err, results) => {
            if (err) {
                console.error("Delete Error (ACHEIVES):", err);
                return res.status(500).json({ message: 'Error deleting goal activities' });
            }

            const deleteGoalQuery = 'DELETE FROM Goals WHERE goal_id = ? AND user_id = ?';

            connection.query(deleteGoalQuery, [goal_id, user_id], (err, results) => {
                if (err) {
                    console.error("Delete Error (Goals):", err);
                    return res.status(500).json({ message: 'Error deleting goal' });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ message: 'Goal not found or unauthorized' });
                }

                res.status(200).json({ message: 'Goal and its associated activities deleted successfully!' });
            });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const viewActivity = (req, res) => {
    try {
        const user_id = req.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is not present' });
        }

        const query = 'SELECT * FROM Activities WHERE user_id = ? ORDER BY date DESC';

        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Fetch Error (Activities):", err);
                return res.status(500).json({ message: 'Error retrieving activities' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No activities found' });
            }

            res.status(200).json({ activities: results });
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const viewGoal = (req, res) => {
    try {
        const { user_id } = req; // Extract user_id from the request

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const query = 'SELECT * FROM Goals WHERE user_id = ? ORDER BY start_date DESC';

        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Database Error (viewGoal):", err);
                return res.status(500).json({ message: 'Failed to retrieve goals' });
            }

            if (!results.length) {
                return res.status(404).json({ message: 'No goals found for this user' });
            }

            return res.status(200).json({ goals: results });
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





