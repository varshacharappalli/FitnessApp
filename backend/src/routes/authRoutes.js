import express from 'express';
import { signUp,signIn,logOut,updatePfp } from '../controllers/auth.controllers.js';

const authRoutes=express.Router();

authRoutes.post('/signup',signUp);
authRoutes.post('/signin',signIn);
authRoutes.post('/logout',logOut);
authRoutes.put('/update-pfp',updatePfp);

export default authRoutes;