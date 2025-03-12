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
