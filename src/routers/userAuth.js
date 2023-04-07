import express from "express";
import * as dotenv from 'dotenv';
import userController from "../controllers/userController.js";
dotenv.config()
const router = express();


// User REGISTER
router.post("/register", async (req, res) => {
   const userData = req.body;
   const resData = await userController.registerUser(userData);
   res.status(resData.status).json(resData);
});

// Send OTP
router.post("/send-otp", async (req, res) => {
   const userData = req.body;
   const resData = await userController.sendOTP(userData);
   res.status(resData.status).json(resData);
 });

//  verify OTP
 router.post("/verify-otp",async (req,res)=>{
   const userData = req.body;
   const resData = await userController.verifyOTP(userData);
   res.status(resData.status).json(resData);
 });

 //  OTP less authentication
router.get("/otpless-auth/:waId", async(req, res) => {
  const waId = req.params.waId;
  const resData = await userController.otpLess(waId);
  res.status(resData.status).json(resData);
});
  
export default router;