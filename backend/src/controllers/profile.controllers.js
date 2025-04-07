import connection from "../lib/sql.js";

export const createProfile = (req, res) => {
    const { height, weight, difficulty_level } = req.body;

    if (!height || !weight || !difficulty_level) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user_id = req.user_id; 

        const query = "INSERT INTO Profiles(user_id, height, weight, difficulty_level) VALUES (?, ?, ?, ?)";
        connection.query(query, [user_id, height, weight, difficulty_level], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Error in profile creation", error: err });
            }

            return res.status(201).json({ message: "Profile created successfully" });
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user profile
export const getProfile = (req, res) => {
    console.log("getProfile called, user_id:", req.user_id);
    try {
        const userId = req.user_id;
        
        const query = "SELECT * FROM profiles WHERE user_id = ?";
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Database Error in getProfile:", err);
                return res.status(500).json({ 
                    message: "Error fetching profile",
                    error: err.message,
                    code: err.code
                });
            }

            console.log("Profile results:", results);
            if (!results.length) {
                return res.status(404).json({ 
                    message: "Profile not found",
                    userId: userId
                });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.error("Server Error in getProfile:", error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Get user details
export const getUserDetails = (req, res) => {
    console.log("getUserDetails called, user_id:", req.user_id);
    try {
        const userId = req.user_id;
        
        // First get the user details
        const userQuery = "SELECT * FROM users WHERE user_id = ?";
        
        connection.query(userQuery, [userId], (err, userResults) => {
            if (err) {
                console.error("Database Error in getUserDetails (user):", err);
                return res.status(500).json({ 
                    message: "Error fetching user details",
                    error: err.message,
                    code: err.code
                });
            }

            if (!userResults.length) {
                return res.status(404).json({ 
                    message: "User not found",
                    userId: userId
                });
            }
            
            // Then get the first email for this user
            const emailQuery = "SELECT email FROM email WHERE user_id = ? LIMIT 1";
            
            connection.query(emailQuery, [userId], (emailErr, emailResults) => {
                if (emailErr) {
                    console.error("Database Error in getUserDetails (email):", emailErr);
                    return res.status(500).json({ 
                        message: "Error fetching user email",
                        error: emailErr.message,
                        code: emailErr.code
                    });
                }
                
                // Combine user details with email
                const userDetails = {
                    ...userResults[0],
                    email: emailResults.length > 0 ? emailResults[0].email : null
                };
                
                console.log("User details with email:", userDetails);
                res.json(userDetails);
            });
        });
    } catch (error) {
        console.error("Server Error in getUserDetails:", error);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Update profile
export const updateProfile = (req, res) => {
    const { height, weight, difficulty_level } = req.body;
    const userId = req.user_id;

    try {
        // Check if profile exists
        const checkQuery = "SELECT * FROM profiles WHERE user_id = ?";
        connection.query(checkQuery, [userId], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Error checking profile" });
            }

            if (results.length) {
                // Update existing profile
                const updateQuery = "UPDATE profiles SET height = ?, weight = ?, difficulty_level = ? WHERE user_id = ?";
                connection.query(updateQuery, [height, weight, difficulty_level, userId], (err, results) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({ message: "Error updating profile" });
                    }
                    res.json({ message: "Profile updated successfully" });
                });
            } else {
                // Create new profile
                const insertQuery = "INSERT INTO profiles (user_id, height, weight, difficulty_level) VALUES (?, ?, ?, ?)";
                connection.query(insertQuery, [userId, height, weight, difficulty_level], (err, results) => {
                    if (err) {
                        console.error("Database Error:", err);
                        return res.status(500).json({ message: "Error creating profile" });
                    }
                    res.json({ message: "Profile created successfully" });
                });
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};