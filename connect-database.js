const { Client } = require("cassandra-driver");
const client = new Client({
      cloud: {
      secureConnectBundle: "./secure-connect-demo2.zip",
      },
      credentials: {
      username: "ZWiLGWBUBymfOKLOCBCJyfqz",
      password: "LR95o0z77W,H01ZdY_oa1OrlnQieDg.JLMPGEFKEzYJhZcxBjJ4H5wW93mpQpKi-ge8sF2EHW-legGtZsjL51s1-k6.5-G00tL2DIB4a6S4Khoh0z_7uPT3Kn_ZQ.rHn",
      },
});
client.connect();

module.exports= client

const connectDB= async () => {
    try { 
        const rs = await client.execute("SELECT * FROM system.local");
        console.log(`Your cluster returned ${rs.rowLength} row(s)`);
        module.exports= client
     }
     catch(err) {
         console.log(err)
     }
 }
 
 module.exports= connectDB
