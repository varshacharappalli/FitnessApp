import mysql2 from 'mysql2';

const connection=mysql2.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'dontlogin@1234',
    database:'FITNESS'
});

connection.connect((err)=>{
    if(err){
        console.log("The error is:",err);
        return;
    }
    console.log('Connected to Fitness database');
})

export default connection;

