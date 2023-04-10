import express from "express";
import * as dotenv from 'dotenv';
import pegController from "../controllers/pegController.js";
dotenv.config()
const router = express();


// User REGISTER
router.post("/register", async (req, res) => {
   const pegData = req.body;
   const resData = await pegController.registerPEG(pegData);
   res.status(resData.status).json(resData);
});

// Send OTP
router.post("/send-otp", async (req, res) => {
   const pegData = req.body;
   const resData = await pegController.sendOTP(pegData);
   res.status(resData.status).json(resData);
 });

//  verify OTP
 router.post("/verify-otp",async (req,res)=>{
   const pegData = req.body;
   const resData = await pegController.verifyOTP(pegData);
   res.status(resData.status).json(resData);
 });

 //  OTP less authentication
router.get("/otpless-auth/:waId", async(req, res) => {
  const waId = req.params.waId;
  const resData = await pegController.otpLess(waId); 
  res.status(resData.status).json(resData);
});
  
export default router;