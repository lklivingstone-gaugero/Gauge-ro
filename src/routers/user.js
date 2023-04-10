import express from "express";
import * as dotenv from 'dotenv';
import userController from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
dotenv.config()
const router = express();

// get user data from id
router.get("/get-user", verifyToken, async (req, res) => {
    const userId = await req.user.id;
    const resData = await userController.getUserDataById(userId);
  res.status(resData.status).json(resData);
  });

// Delete user
router.delete("/delete",verifyToken, async (req, res) => {
    const userId = await req.user.id;
    const resData = await userController.deleteUserData(userId);
    res.status(resData.status).json(resData);
  });

//  User raised Complaint
router.post("/raised_complaints", verifyToken, async (req, res) => {
    const userId = await req.user.id;
    const complaintData = req.body;
    const resData = await userController.complaintRaised(userId,complaintData);
    res.status(resData.status).json(resData);
  });

//   user select the slot
router.post("/select_slot", verifyToken,async (req,res)=>{
    // const userId = await req.user.id;
    const complaintData = req.body;
    const resData = await userController.selectSlot(complaintData);
    res.status(resData.status).json(resData);
})

// user withdrawn complaint
router.delete('/withdrawn-complaint', verifyToken, async (req, res) => {
    const complaintData = req.body;
    const resData = await userController.withdrawnComplaint(complaintData);
    res.status(resData.status).json(resData);
  });
  
router.patch("/issue-resolved/:id", verifyToken, async (req, res) => {
    const complaintId = req.params.id;
    const resData = await userController.isSolved(complaintId);
    res.status(resData.status).json(resData);
  
  });

router.post("/feedback", verifyToken, async (req, res) => {
  const userId = await req.user.id;
  const feedbackData = req.body;
  const resData = await userController.feedback(userId,feedbackData);
  res.status(resData.status).json(resData);
  });

router.get("/reschedule/:id",verifyToken,async(req,res)=>{
  const userId = await req.user.id;
  const complaintId = req.params.id;
  const resData = await userController.rescheduleComplaint(userId,complaintId);
  res.status(resData.status).json(resData);
})

router.patch("/reschedule",verifyToken,async(req,res)=>{
  const userId = await req.user.id;
  const rescheduleData = req.body;
  const resData = await userController.rescheduleSelectSlot(userId,rescheduleData);
  res.status(resData.status).json(resData);
})

export default router;