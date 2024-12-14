import passport from "passport";
import { registerUser } from "../controllers/authController";
import { Router } from "express";
import googleConfig from "../config/googleConfig";


const router = Router();


router.post('/register', registerUser)


router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }) )


router.get('/auth/google/callback', 
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
      // Handle successful authentication (e.g., generate JWT)
      res.redirect('http://localhost:3000/login'); // Adjust as necessary
    }
);
  
export default router