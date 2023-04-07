import response from "../models/response.js";
import constants from "../models/constants.js";
import pegService from "../services/pegService.js";
import messages from "../models/messages.js";


class pegController {
    async registerPEG(pegData) {
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.registerPEG(pegData);
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

    async sendOTP(pegData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.sendOTP(pegData);
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

    async verifyOTP(pegData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const result = await pegService.verifyOTP(pegData);
            console.log(result)
            if(result.type === "success" || result.message == "Mobile no. already verified"){
                const accessToken = await pegService.accessToken(pegData.mobile_number);
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
            const mobileNumber = await pegService.optLess(waId);
            const accessToken = await pegService.accessToken(mobileNumber);
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

    async getPEGDataById(pegId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const pegData = await pegService.getPEGDataById(pegId);
            res.status = httpStatus.success;
            res.message = pegData.rows[0];
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

    async deletePEGData(pegId) {
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.deletePEGData(pegId);
            res.status = httpStatus.success;
            res.message = messages.userDeleted;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async getPEGProfileData(pegId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const profileData = await pegService.getPEGProfileData(pegId);
            res.status = httpStatus.success;
            res.message = profileData;
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

    async createWorkTable(pegId,workTableData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.createWorkTable(pegId,workTableData);
            res.status = httpStatus.success;
            res.message = messages.workTableCreated;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }
    async allService(pegId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            const pegData = await pegService.allService(pegId);
            res.status = httpStatus.success;
            res.message = messages.allService;
            res.data = pegData.rows
        }
        catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async issueSolved(complaintId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.issueSolved(complaintId);
            res.status = httpStatus.success;
            res.message = messages.isSolvedUser;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }
    async rescheduleComplaint(plumberId,complaintId){
        var res = new response();
        const { httpStatus } = constants;
        try {
            await pegService.rescheduleComplaint(plumberId,complaintId);
            res.status = httpStatus.success;
            res.message = messages.isSolvedUser;
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }

    async issueNotSolved(plumberId,complaintData){
        var res = new response();
        const { httpStatus } = constants;
        try {
            console.log("complaintData->",complaintData)
            const {option,complaintId} = complaintData;
            const data = await pegService.revisitComplaint(plumberId,complaintId);
            res.status = httpStatus.success;
            res.message = messages.isSolvedUser;
            res.data = data;
            
        } catch (error) {
            res.message = error.message;
            res.status = httpStatus.serverError;
        }
        return res;
    }
}
export default new pegController();