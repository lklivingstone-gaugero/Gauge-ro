import client from "../../../db.js";
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class database{
    async registerUser(data){
        const {countryCode, mobileNumber, email, firstName, lastName, id, isActive} = data;
        const newUserQuery = `INSERT INTO demo2.register (country_code, mobile_number, email, first_name, last_name, id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await client.execute(newUserQuery,[countryCode, mobileNumber, email, firstName, lastName, id, isActive]);
    }  
    
    async getUserData(mobile_number){
        var checkUserQuery = `select * from demo2.register WHERE mobile_number = ? ALLOW FILTERING`;
        const data = await client.execute(checkUserQuery,[mobile_number]);
        return data;
    }

    async  getUserDataById(id){
      var checkUserQuery = `select * from demo2.register WHERE id = ? `;
      const data = await client.execute(checkUserQuery,[id]);
      return data;
  }

    async sendOTP(data){
        const{country_code,mobile_number} = data;
        const var1 = 10;
        try {
            const number = country_code + mobile_number;
            const response = await fetch(`https://api.msg91.com/api/v5/otp?template_id=${process.env.template_id}&mobile=${number}&authkey=${process.env.auth_key}`, {
              method: 'POST',
              body: JSON.stringify({var1}),
              headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          return data;
          } 
          catch(err){
            console.log(err);
            return err;
          }
    }

    async verifyOTP(data){
        const{country_code,mobile_number,otp} = data;
        try {
            const number = country_code + mobile_number;
            const response = await fetch(`https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.auth_key}&mobile=${number}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
          });
          const result = await response.json();
          return result;
          } 
          catch(err){
            console.log(err);
            return err;
          }
    }

    async optLess(waId){ 
      try {
        const response = await fetch('https://gauge.authlink.me', {
          method: 'POST',
          body: JSON.stringify({waId}),
          headers: { 'clientSecret':`${process.env.client_secret}`, 'clientId':`${process.env.client_id}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      const mobileNumber = data.user.waNumber.slice(2, 12);
      return mobileNumber;
      } 
      catch (err) {
        return err;
      }
      
    }

    async deleteUserData(id){
      const deleteUserQuery = `DELETE FROM demo2.register WHERE id=?`;
      await client.execute(deleteUserQuery, [id]);
    }

    async registerPEG(data){
      const {countryCode, mobileNumber, email, firstName, lastName, id} = data;
      const newUserQuery = `INSERT INTO demo2.peg_register (country_code, mobile_number, email, first_name, last_name, id) VALUES (?, ?, ?, ?, ?, ?)`;
      await client.execute(newUserQuery,[countryCode, mobileNumber, email, firstName, lastName, id]);
  }  

  async getPEGData(mobile_number){
    var checkUserQuery = `select * from demo2.peg_register WHERE mobile_number = ? ALLOW FILTERING`;
    const data = await client.execute(checkUserQuery,[mobile_number]);
    return data;
  }

  async getPEGDataById(id){
    var checkUserQuery = `select * from demo2.peg_register WHERE id = ? `;
    const data = await client.execute(checkUserQuery,[id]);
    return data;
  }

  async deletePEGData(id){
    const deleteUserQuery = `DELETE FROM demo2.peg_register WHERE id=?`;
    await client.execute(deleteUserQuery, [id]);
  }

  async createWorkTable(data){
    // INSERT INTO demo2.work_table1 (plumber_id, date, available, slota, slotb, slotc, work_count)
// VALUES (uuid(), '2023-03-23 10:00:00', true, {isbooked: false}, {isbooked: false}, {isbooked: false}, '5');
    const {plumberId, date, available, workCount} = data;
    const workTableQuery = `INSERT INTO demo2.work_table(plumber_id, date, available, work_count, slota, slotb, slotc) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const slotc = { isbooked: false };
    const slota = { isbooked: false };
    const slotb = { isbooked: false };
    await client.execute(workTableQuery, [plumberId, date, available, workCount, slota, slotb, slotc], { prepare: true });

} 

async getComplaintData(id){
  const complaintQuery = `SELECT * FROM demo2.complaint where id = ?`;
  const result = await client.execute(complaintQuery, [id]);
  return result.rows;
}

async complaintRaised(data){
  const {id,raisedTime,status,issueType,userId} = data;
  const complaintQuery = `INSERT INTO demo2.complaint(id, raised_time, status,issue_type,customer_id) VALUES (?, ?, ?, ?, ?)`;
  await client.execute(complaintQuery, [id,raisedTime,status,issueType,userId]);
}

async findAvailableSlot(date){
  const query = `SELECT slota, slotb, slotc FROM demo2.work_table
  WHERE date = ?
  ALLOW FILTERING
  `;
  const result = await client.execute(query, [date], { prepare: true });
  return result.rows;
}

async workTableQuery(date,slot){
  // SELECT * FROM demo2.work_table1 WHERE date= '2023-03-23T00:00:00.000Z'  AND slota={complaintId:null,isbooked:false} ALLOW FILTERING
  const workTableQuery = `SELECT * FROM demo2.work_table WHERE date = ? AND ${slot} = ? ALLOW FILTERING`;
  const params = [date, {complaintid:null,isbooked:false}];
  const workTableResult = await client.execute(workTableQuery, params, { prepare: true });
  return workTableResult;

}

async updateComplaintQuery(complaintId,plumberId,slots,bookedSlot){
  const updateComplaintQuery = `UPDATE demo2.complaint SET plumber_id =?,bookedslot=?, selectedslots=? WHERE id=?`;
  await client.execute(updateComplaintQuery, [plumberId,bookedSlot,slots,complaintId]); 
}

async updateWorkTableQuery(date,slot,complaintId,plumberId,workCount){
  const updateWorkTableQuery = `UPDATE demo2.work_table SET ${slot} = ?, work_count = ? WHERE plumber_id = ? AND date = ?`;
  const slotData = {complaintid: complaintId, isbooked: true};
  await client.execute(updateWorkTableQuery, [slotData, workCount, plumberId, date], { prepare: true });
  
}

async allService(plumberId){
    var allServicesQuery =`select * from demo2.work_table WHERE plumber_id=? AND work_count > ?ALLOW FILTERING`;
    const allServiceResult=client.execute(allServicesQuery, [plumberId,'0'])
    return allServiceResult;
}
 
async workCountQuery(plumberId,date){
    const workCountQuery = `select work_count from demo2.work_table where plumber_id =? AND date =?`
    const workTableResult = await client.execute(workCountQuery, [plumberId,date]);
    return workTableResult;
} 

async deleteComplaintQuery(complaintId){
  const deleteComplaintQuery = `DELETE FROM demo2.complaint WHERE id = ?`;
  await client.execute(deleteComplaintQuery, [complaintId]);
}

async deleteWorkTableQuery(slot,workCount,plumberId,date){
  const updateWorkTableQuery = `UPDATE demo2.work_table SET ${slot} = ?, work_count = ? WHERE plumber_id = ? AND date = ?`;
  const slotData = {complaintid: null, isbooked: false};
  await client.execute(updateWorkTableQuery, [slotData, workCount, plumberId, date], { prepare: true });
}

async isSolvedUser(complaintSolvedTime,complaintStatus,complaintId){
    const updateComplaintQuery = `UPDATE demo2.complaint SET issolved_user =?,solved_time=?, status=? WHERE id=?`;
    client.execute(updateComplaintQuery, [true, complaintSolvedTime, complaintStatus, complaintId]);
}

async issueSolvedPEG(complaintId){
  const updateComplaintQuery = `UPDATE demo2.complaint SET issolved_peg =? WHERE id=?`;
  client.execute(updateComplaintQuery, [true, complaintId]);
}

async feedbackQuery(data){
  const {id, complaintId, customerId, case1, case2, case3, rating,comment} = data;
  const feedbackQuery = `INSERT INTO demo2.feedback_table(id,complaint_id,customer_id, case1, case2, case3, rating,comments) VALUES (?,?,?,?,?,?,?,?)`;
  client.execute(feedbackQuery, [id, complaintId, customerId, case1, case2, case3, rating, comment] );
}

async updateFeebackInComplaintQuery(feedbackId,complaintId){
  const updateComplaintQuery = `UPDATE demo2.complaint SET feedback_id =? WHERE id=?`;
  client.execute(updateComplaintQuery, [feedbackId, complaintId]);
}

async findAvailableSlotPEG(plumberId){
  const query = `SELECT date,slota, slotb, slotc FROM demo2.work_table
  WHERE plumber_id = ?
  ALLOW FILTERING`;
  const result = await client.execute(query, [plumberId], { prepare: true });
  return result.rows;
}
}

export default new database();
