import bcrypt from 'bcryptjs';

import connection from '../lib/sql';
import { query } from 'express';


checkUserExists=async(username)=>{
    return new Promise((resolve,reject)=>{
        const query='Select * from Users where username=? LIMIT 1';
        connection.query((query,[username],(err,results)=>{
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0);
        })
        )
    }
    )
}

export const signUp = async (req, res) => {
    try {
        const { first_name, last_name, password, dob, age, gender, username } = req.body;

        if (!first_name || !last_name || !dob || !password || !age || !gender || !username) {
            return res.status(400).json({ message: 'All fields must be entered' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const userExists = await checkUserExists(username);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO Users (first_name, last_name, password, dob, age, gender, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(query, [first_name, last_name, hashed_password, dob, age, gender, username], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            const user_id = results.insertId; 

            const emailQuery = 'INSERT INTO EMAIL (user_id, email) VALUES ?';
            const emailValues = emails.map(email => [user_id, email]);

            connection.query(emailQuery, [emailValues], (emailErr, emailResults) => {
                if (emailErr) {
                    return res.status(500).json({ message: 'Error inserting emails', error: emailErr });
                }
                res.status(201).json({ message: 'User registered successfully with emails' });
            });
            res.status(201).json({ message: 'User registered successfully' });
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const signIn=(req,res)=>{
    try {
        const {username,password}=req.body;
        if(!username||!password){
            return res.status(404).json({message:'All the fields must be entered'});
        }
        const userPassword="";
        const query='Select password from Users where username=? LIMIT 1'
        connection.query(query,[username],(err,results)=>{
            if(err){
                return res.status(500).json({ message: 'Error'});
            }
            userPassword=results;
        })
        const isPasswordCorrect=bcrypt.compare(password,userPassword);
        if(!isPasswordCorrect){
            return res.status(500).json({ message: 'Password is incorrect'});
        }
        res.status(200).json({message:'User signed in successfully'});
    } catch (error) {
        console.log(error.message);
    }
}


export const logOut=(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error.message);
    }
}