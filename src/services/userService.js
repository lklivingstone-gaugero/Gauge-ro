import utils from "./common/utils.js";
import database from "./common/database.js";
import messages from "../models/messages.js";
import jwt from "jsonwebtoken";
import queryOnSlot from "../services/common/slot.js"

class userServices {
    async registerUser(userData) {
        try {
            const result = await database.getUserData(userData.mobile_number);
            if(result.rows.length != 0){
                throw Error(messages.numberAlreadyExists);
            }
            const data={
                id: utils.getUuid(),
                email: userData.email,
                countryCode: userData.country_code,
                mobileNumber: userData.mobile_number,
                firstName: userData.first_name,
                lastName: userData.last_name,
                isActive: false
            };
            await database.registerUser(data);
        } catch (error) {
            console.error(error);
            throw error;

        }
    }

    async getUserDataById(userId){
        try {
            const userData = await database.getUserDataById(userId);
            if(userData.rows.length == 0){
                throw Error(messages.notRegister);
            }
            return userData;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async sendOTP(userData){
        try {
            const result = await database.getUserData(userData.mobile_number);
            if(result.rows.length == 0){
                throw Error(messages.notRegister);
            }
            await database.sendOTP(userData);   
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async verifyOTP(userData){
        try {
            const result = await database.verifyOTP(userData); 
            return result;     
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async accessToken(mobile_number){
        try {
            console.log(mobile_number)
            const data = await database.getUserData(mobile_number);
            if(data.rows.length == 0){
                throw Error(messages.notRegister);
            }
            else{
                const accessToken = jwt.sign(
                    {
                      id: data.rows[0].id
                    },
                    process.env.JWT_ACCESS_KEY,
                    {
                      expiresIn: "2000m",
                    });
                return accessToken;
            }    
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async optLess(waId){
        try {
            const mobileNumber = await database.optLess(waId); 
            return mobileNumber;     
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteUserData(userId){
        try{
            await database.deleteUserData(userId);
        } catch (error) {
            console.error(error);
            throw error;
        }
    } 

    async complaintRaised(userId,complaintData){
        try {
            const data ={
                id : utils.getUuid(),
                raisedTime : new Date(),
                status: "Active",
                issueType : complaintData.issue_type,
                userId : userId
            }
            await database.complaintRaised(data);
            return data.id;
        } catch (error) {
            console.error(error);
            throw error;   
        }
    }

    async findAvailableSlot(userId){
        try {
            console.log(userId)
            const now = new Date();
            const year = now.getFullYear();
            const month = ('0' + (now.getMonth() + 1)).slice(-2); 
            const day = ('0' + now.getDate()).slice(-2);
            const date = `${year}-${month}-${day}`; 
            const availableSlot = await database.findAvailableSlot(date);
            const availableSlotData = [];
            availableSlotData.push(date);
            availableSlotData.push(availableSlot)
            return availableSlotData;    
        } catch (error) {
            console.error(error);
            throw error;  
        }
    }

    async workTableResult(date,slots){
        const d = new Date(date)
        for(let i=0;i<slots.length;i++){
            try {
                const slot = await queryOnSlot.timeToSlot(slots[i])
                let workTableResult;
                workTableResult = await database.workTableQuery(d,slot)
                const result ={
                    plumberId:workTableResult.rows[0].plumber_id,
                    workCount:workTableResult.rows[0].work_count,
                    slot:slot
                }
                console.log("result->",result)
                return result;
            }
            catch(error){
                console.log(error)
                continue;
            }
        }
    }
    async selectSlot(complaintData,result){
        const {date,complaintId,slots}=complaintData;
        try {
            const slot = result.slot;
            const d = new Date(date)
            const bookedSlot = await queryOnSlot.slotToTime(slot)
            const plumberId = result.plumberId;
            const workCount = (+result.workCount+1).toString()
            await database.updateComplaintQuery(complaintId,plumberId,slots,bookedSlot);
            await database.updateWorkTableQuery(d,slot,complaintId,plumberId,workCount);
            const selectSlotData={
                complaintId,date,slot,plumberId
            }
            return selectSlotData;       
        }
        catch (error) {
            console.error(error);
            throw error; 
        }  
    }

    async withdrawnComplaint(complaintData){
        try {
            const {complaintId,date,slot,plumberId} = complaintData;
            const d = new Date(date);
            let workCount = await database.workCountQuery(plumberId,d);
            workCount = (+workCount.rows[0].work_count-1).toString()
            await database.deleteComplaintQuery(complaintId);
            await database.deleteWorkTableQuery(slot,workCount,plumberId,d);
        } catch (error) {
            console.error(error);
            throw error;  
        }
    }

    async isSolved(complaintId){
        try {
            const complaintSolvedTime = new Date();
            const complaintStatus = "Resolved";
            await database.isSolvedUser(complaintSolvedTime,complaintStatus,complaintId); 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async feedback(userId,feedbackData){
        try {
            const data={
                id: utils.getUuid(),
                complaintId: feedbackData.complaintId,
                case1: feedbackData.case1,
                case2: feedbackData.case2,
                case3: feedbackData.case3,
                rating: feedbackData.rating,
                customerId:userId,
                comment: feedbackData.comment
            };
            await database.feedbackQuery(data);
            await database.updateFeebackInComplaintQuery(data.id,feedbackData.complaintId)
        
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async workCountQuery(oldPlumberId,oldDate,oldBookedSlot){
        try {    
            let d2 = new Date(oldDate);
            console.log(oldPlumberId,d2);
            let oldWorkCount = await database.workCountQuery(oldPlumberId,d2);
            oldWorkCount = (+oldWorkCount.rows[0].work_count-1).toString()
            await database.deleteWorkTableQuery(oldBookedSlot,oldWorkCount,oldPlumberId,d2);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async rescheduleSelectSlot(userId,rescheduleData,result){
        console.log(userId)
        const {oldDate,complaintId,slots,newDate,oldPlumberId,oldBookedSlot}=rescheduleData;
        const newSlot= await queryOnSlot.slotToTime(result.slot);
        let d1 = new Date(newDate);
        try {
            await this.workCountQuery(oldPlumberId,oldDate,oldBookedSlot)
            const plumberId = result.plumberId;
            const workCount = (+result.workCount+1).toString()
            await database.updateComplaintQuery(complaintId,plumberId,slots,newSlot);
            await database.updateWorkTableQuery(d1,newSlot,complaintId,plumberId,workCount);
            const selectSlotData={
                complaintId,newDate,newSlot,plumberId
            }
            console.log(selectSlotData)
            return selectSlotData;
        }    
        catch (error) {
            console.error(error);
            throw error; 
        }
    }
}

export default new userServices();