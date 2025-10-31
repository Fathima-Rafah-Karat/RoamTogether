import {Router} from "express";
 
const authRouter =Router();
authRouter.post('/signup',(req,res)=>res.send({title:"signup"}));
authRouter.post('/signin',(req,res)=>res.send({title:"signin"}));
authRouter.post('/signout',(req,res)=>res.send({title:"signout"}));

export default authRouter;