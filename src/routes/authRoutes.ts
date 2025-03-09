import passport from "passport";
import { verifyUser } from "@/controllers/auth-controller/verifyUser";
import { Router } from "express";
import { registerUser } from "@/controllers/auth-controller/registerController";
import loginUser from "../controllers/auth-controller/loginController";
import adminLoginController from "@/controllers/auth-controller/adminLoginController";


const router = Router();


router.post('/register', registerUser)


router.post('/admin/login',adminLoginController)


router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))


router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {

    if (!req?.user) {
      res.redirect('http://localhost:3000/login')
    }

    const user: any = req?.user;

    console.log(user?.id, 'skskslkslk')
    // Handle successful authentication (e.g., generate JWT)
    // res.redirect('http://localhost:3000/user'); // Adjust as necessary
    // res.json({ message: 'success' })
  }
);

router.post('/verify', verifyUser)

router.post('/login', loginUser)

export default router