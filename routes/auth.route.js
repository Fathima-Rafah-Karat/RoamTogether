import { Router } from "express";

import { signUp, signIn,signOut,viewsignup } from "../controller/auth.controller.js";
 
const authRouter = Router();
authRouter.post('/signup', signUp);
authRouter.get("/viewsignup",viewsignup)
authRouter.post('/signin', signIn);
authRouter.post('/signout', signOut);

export default authRouter;