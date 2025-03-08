import express from 'express';
import authRoutes from './routes/authRoutes.js'
import { connection } from './lib/sql.js'

const app=express();

const PORT=5003;
app.use(express.json());

app.use('/auth',authRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port:",PORT);
})