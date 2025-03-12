import express from 'express';
import { signUp,signIn,logOut } from '../controllers/auth.controllers.js';

const authRoutes=express.Router();

authRoutes.post('/signup',signUp);
authRoutes.post('/signin',signIn);
authRoutes.post('/logout',logOut);

export default authRoutes;