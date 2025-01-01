import passport from "passport";
import { registerUser, verifyUser } from "../controllers/authController";
import loginUser from "../controllers/auth-controller/loginController";
import { Router } from "express";


const router = Router();


router.post('/register', registerUser)


router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))


router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    // Handle successful authentication (e.g., generate JWT)
    res.redirect('http://localhost:3000/signup'); // Adjust as necessary
  }
);

router.post('/verify', verifyUser)

router.post('/login', loginUser)

export default router