import utils from "./common/utils.js";
import database from "./common/database.js";
import messages from "../models/messages.js";
import jwt from "jsonwebtoken";
import queryOnSlot from "../services/common/slot.js"

class pegService {
    async registerPEG(pegData){
        try {
            const result = await database.getPEGData(pegData.mobile_number);
            if(result.rows.length != 0){
                throw Error(messages.numberAlreadyExists);
            }
            const data={
                id: utils.getUuid(),
                email: pegData.email,
                countryCode: pegData.country_code,
                mobileNumber: pegData.mobile_number,
                firstName: pegData.first_name,
                lastName: pegData.last_name
            };
            await database.registerPEG(data);
        } catch (error) {
            console.error(error);
            throw error;

        }
    }

    async accessToken(mobile_number){
        try {
            const data = await database.getPEGData(mobile_number);
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

    
    async getPEGDataById(pegId){
        try {
            const pegData = await database.getPEGDataById(pegId);
            if(pegData.rows.length == 0){
                throw Error(messages.notRegister);
            }
            return pegData;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async sendOTP(pegData){
        try {
            const result = await database.getPEGData(pegData.mobile_number);
            if(result.rows.length == 0){
                throw Error(messages.notRegister);
            }
            await database.sendOTP(pegData);   
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async verifyOTP(pegData){
        try {
            const result = await database.verifyOTP(pegData); 
            return result;     
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

    async deletePEGData(pegId){
        try{
            await database.deletePEGData(pegId);
        } catch (error) {
            console.error(error);
            throw error;

        }
    } 

    async getPEGProfileData(pegId){
        try {
            const pegData = await database.getPEGDataById(pegId);
            if(pegData.rows.length == 0){
                throw Error(messages.notRegister);
            }
            const profileData = {
                plumberId : pegData.rows[0].id,
                firstName : pegData.rows[0].first_name,
                lastName : pegData.rows[0].last_name,
                email : pegData.rows[0].email,
                phoneNo : pegData.rows[0].mobile_number,
                rating: 4,
                behavior:4,
                attitude:4,
                workQuality:3.5,
                punctuality:3.5,
                technicalKnowledge:3.5,
                scopeOfImprovement: [],
                strongPoint: [],
                totalComplaintSolved: 0,
              };
              return profileData;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createWorkTable(pegId,workTableData){
        try {
            const data ={
                plumberId : pegId,
                date : new Date(workTableData.date),
                available : workTableData.available,
                workCount : BigInt(0).toString(),
            }
            await database.createWorkTable(data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async allService(pegId){
        try {
            const pegData = await database.allService(pegId);
            if(pegData.rows.length == 0){
                throw Error(messages.notWork);
            }
            return pegData;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }  
    
    async issueSolved(complaintId){
        try {
            await database.issueSolvedPEG(complaintId); 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async workTable(plumberId,date,bookedSlot){
        try {    
            bookedSlot = await queryOnSlot.timeToSlot(bookedSlot)
            let d = new Date(date);
            let oldWorkCount = await database.workCountQuery(plumberId,d);
            const workCount = (+oldWorkCount.rows[0].work_count-1).toString()
            console.log(workCount);
            await database.deleteWorkTableQuery(bookedSlot,workCount,plumberId,d);
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async availablePlumber(complaintId,date,slots,plumberId){
        const d = new Date(date)
        for(let i=0;i<slots.length;i++){
            try {
                const slot = await queryOnSlot.timeToSlot(slots[i])
                let workTableResult;
                workTableResult = await database.workTableQuery(d,slot)
                if(workTableResult.rows[0].plumber_id !==plumberId){
                    const result ={
                        plumberId:workTableResult.rows[0].plumber_id,
                        workCount:workTableResult.rows[0].work_count,
                        slot:slot
                    }
                    console.log("result->",result)
                    return result;
                }
            }
            catch(error){
                console.log(error)
                continue;
            }
        }
    }
    async rescheduleComplaint(plumberId,complaintId){
        console.log(plumberId)
        const complaintData = await database.getComplaintData(complaintId);
        console.log(complaintData);
        const {date,bookedSlot,slots}=complaintData;
        try {
            await this.workTable(complaintId,date,bookedSlot);

            const availablePlumberResult = await this.availablePlumber(complaintId,date,slots,plumberId);
            const workCount = (+availablePlumberResult.workCount+1).toString();
            plumberId = availablePlumberResult.plumberId;
            const newSlot = availablePlumberResult.slot;
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

    async revisitComplaint(plumberId,complaintId){
        try {
            const availableSlots = await database.findAvailableSlotPEG(plumberId)
            const bookedSlots = [];
            availableSlots.forEach(obj => {
              const { date,slota, slotb, slotc } = obj;
              const temp=[];
              if (slota.isbooked===false) {
                temp.push("9am-12pm");
              }
              if (slotb.isbooked===false) {
                temp.push("12pm-3pm");
              }
              if (slotc.isbooked===false) {
                temp.push("3pm-6pm");
              }
              if(temp.length !=0){
                const data ={
                    date,
                    slots:temp
                }
                bookedSlots.push(data);
              }
            });
              
              console.log(bookedSlots);
            return bookedSlots;

        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
}
export default new pegService();