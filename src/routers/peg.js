import express from "express";
import * as dotenv from 'dotenv';
import pegController from "../controllers/pegController.js";
import verifyToken from "../middleware/verifyToken.js";
dotenv.config()
const router = express();

// get peg data from id
router.get("/", verifyToken, async (req, res) => {
    const pegId = await req.user.id;
    const resData = await pegController.getPEGDataById(pegId);
  res.status(resData.status).json(resData);
  });

// Delete PEG Guy
router.delete("/delete",verifyToken, async (req, res) => {
    const pegId = await req.user.id;
    const resData = await pegController.deletePEGData(pegId);
    res.status(resData.status).json(resData);
  });

  // PEG guy Profile Data
router.get("/profile-data", verifyToken, async (req, res) => {
    const pegId = await req.user.id;
    const resData = await pegController.getPEGProfileData(pegId);
    res.status(resData.status).json(resData);
  });
  
  
  //  work table
  router.post("/work-table", verifyToken, async (req, res) => {
    // const pegId = await req.user.id;
    const pegId = "680a7be1-748a-44dd-827d-d69118634900";
    const workTableData = req.body;
    const resData = await pegController.createWorkTable(pegId,workTableData);
    res.status(resData.status).json(resData);
  });
  
  
  // get all services
  router.get("/all-services", verifyToken, async (req, res) => {
    // const pegId = await req.user.id;
    const pegId = "680a7be1-748a-44dd-827d-d69118634900";
    const resData = await pegController.allService(pegId);
    res.status(resData.status).json(resData);
  });
  
  router.patch("/issue-resolved/:id", verifyToken, async (req, res) => {
    const complaintId = req.params.id;
    const resData = await pegController.issueSolved(complaintId);
    res.status(resData.status).json(resData);
  
  });

  // reschedule complaint with complaintId;
  router.patch("/reschedule-complaint/:id", verifyToken, async (req, res) => {
    const plumberId = await req.user.id;
    const complaintId = req.params.id;
    const resData = await pegController.rescheduleComplaint(plumberId,complaintId);
    res.status(resData.status).json(resData);
  })
  

// issue not resolved 
router.patch("/issue-not-resolved", verifyToken, async (req, res) => {
  // const plumberId = await req.user.id
  const plumberId = "680a7be1-748a-44dd-827d-d69118634900";
  console.log(plumberId)
  const complaintData = req.body;
  const resData = await pegController.issueNotSolved(plumberId,complaintData);
  res.status(resData.status).json(resData);

}); 

export default router;