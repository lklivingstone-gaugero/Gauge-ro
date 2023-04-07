import { Client } from "cassandra-driver";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({
      cloud: {
      secureConnectBundle: "./secure-connect-demo2.zip",
      },
      credentials: {
      username: "ZWiLGWBUBymfOKLOCBCJyfqz",
      password: "LR95o0z77W,H01ZdY_oa1OrlnQieDg.JLMPGEFKEzYJhZcxBjJ4H5wW93mpQpKi-ge8sF2EHW-legGtZsjL51s1-k6.5-G00tL2DIB4a6S4Khoh0z_7uPT3Kn_ZQ.rHn",
      },
});

export default client;