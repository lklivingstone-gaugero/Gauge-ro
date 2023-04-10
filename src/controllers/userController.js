import response from "../models/response.js";
import constants from "../models/constants.js";
import userService from "../services/userService.js";
import messages from "../models/messages.js";


async function queryOnslots(slots){
    if(slots === "9am-12pm"){
        let str = "slota";
        return str;
    }
    if(slots === "12pm-3pm"){
        let str = "slotb";
        return str;
    }
    if(slots === "3pm-6pm"){
        let str = "slotc";
        return str;
    }
}
class userController {

    async registerUser(userData) {
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.registerUser(userData);
            res.status = httpStatus.success;
            res.message = messages.numberRegister;
        } catch (error) {
            res.message = error.message;
            if (error.message == messages.numberAlreadyExists) {
                res.status = httpStatus.badRequest;
                return res;
            }
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async sendOTP(userData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.sendOTP(userData);
            res.status = httpStatus.success;
            res.message = messages.otpSend;
        } catch (error) {
            res.message = error.message;
            if (error.message == messages.notRegister) {
                res.status = httpStatus.unauthorized;
                return res;
            }
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async verifyOTP(userData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const result = await userService.verifyOTP(userData);
            console.log(result)
            if(result.type === "success" || result.message == "Mobile no. already verified"){
                const accessToken = await userService.accessToken(userData.mobile_number);
                res.status = httpStatus.success;
                res.message = accessToken;
            }
            else{
                res.status = httpStatus.badRequest;
                res.message = result.message;
            }
           
        } catch (error) {
            res.message = error.message;
            if (error.message == messages.notRegister) {
                res.status = httpStatus.unauthorized;
                return res;
            }
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async otpLess(waId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const mobileNumber = await userService.optLess(waId);
            const accessToken = await userService.accessToken(mobileNumber);
                res.status = httpStatus.success;
                res.message = accessToken;
        }
        catch (error) {
            res.message = error.message;
            if (error.message == messages.notRegister) {
                res.status = httpStatus.unauthorized;
                return res;
            }
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async getUserDataById(userId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const userData = await userService.getUserDataById(userId);
            res.status = httpStatus.success;
            res.message = userData.rows[0];
        }
        catch (error) {
            res.message = error.message;
            if (error.message == messages.notRegister) {
                res.status = httpStatus.unauthorized;
                return res;
            }
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async deleteUserData(userId) {
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.deleteUserData(userId);
            res.status = httpStatus.success;
            res.message = messages.userDeleted;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async complaintRaised(userId,complaintData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const complaintId = await userService.complaintRaised(userId,complaintData);
            const availableSlotData = await userService.findAvailableSlot(userId);
            const availableSlots = availableSlotData[1];
            const d = availableSlotData[0];
            const filterSlots = [];
            for(const slot of availableSlots){
                if(slot.slota.isbooked === false){
                    filterSlots.push('9am-12pm');
                    break;
                }
            }
            for(const slot of availableSlots){
                if(slot.slotb.isbooked === false){
                    filterSlots.push('12pm-3pm');
                    break;
                }
            }
            for(const slot of availableSlots){
                if(slot.slotc.isbooked === false){
                    filterSlots.push('3pm-6pm');
                    break;
                }
            }
            const result = {
                date : d,
                complaintId:complaintId,
                availableSlot:filterSlots
            }
            res.status = httpStatus.success;
            res.message = result;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async selectSlot(complaintData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const result = await userService.workTableResult(complaintData.date,complaintData.slots);
            const selectSlotData = await userService.selectSlot(complaintData,result);
            res.status = httpStatus.success;
            res.message = messages.complaintRaised;
            res.data = selectSlotData;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async withdrawnComplaint(complaintData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.withdrawnComplaint(complaintData);
            res.status = httpStatus.success;
            res.message = messages.withdrawnComplaint;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async isSolved(complaintId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.isSolved(complaintId);
            res.status = httpStatus.success;
            res.message = messages.isSolvedUser;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }
    async feedback(userId,feedbackData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await userService.feedback(userId,feedbackData);
            res.status = httpStatus.success;
            res.message = messages.feedback;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async rescheduleComplaint(userId,complaintId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const availableSlotData = await userService.findAvailableSlot(userId);
            const availableSlots = availableSlotData[1];
            const d = availableSlotData[0];
            const filterSlots = [];
            for(const slot of availableSlots){
                if(slot.slota.isbooked === false){
                    filterSlots.push('9am-12pm');
                    break;
                }
            }
            for(const slot of availableSlots){
                if(slot.slotb.isbooked === false){
                    filterSlots.push('12pm-3pm');
                    break;
                }
            }
            for(const slot of availableSlots){
                if(slot.slotc.isbooked === false){
                    filterSlots.push('3pm-6pm');
                    break;
                }
            }
            const result = {
                date : d,
                complaintId:complaintId,
                availableSlot:filterSlots
            }
            res.status = httpStatus.success;
            res.message = result;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async rescheduleSelectSlot(userId,rescheduleData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const result = await userService.workTableResult(rescheduleData.newDate,rescheduleData.slots);
            const selectSlotData = await userService.rescheduleSelectSlot(userId,rescheduleData,result);
            console.log(selectSlotData)
            res.status = httpStatus.success;
            res.message = messages.complaintRaised;
            res.data = selectSlotData;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }
}
export default new userController();