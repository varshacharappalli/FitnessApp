import mysql2 from 'mysql2';

export const connection=mysql2.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'dontlogin@1234'
});

connection.connect((err)=>{
    if(err){
        console.log("The error is:",err);
        return;
    }
    console.log('Connected to MySQL database');
})

