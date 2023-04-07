import express from "express";
import config from "./src/models/config.js";
import utils from "./src/services/common/utils.js";
import userAuth from "./src/routers/userAuth.js";
import client from "./db.js";
import userRoute from "./src/routers/user.js";
import pegAuth from "./src/routers/pegAuth.js";
import pegRoute from "./src/routers/peg.js";

async function connectDB(){
    try {
        await client.connect()
        console.log("Connected to DB")
    }
    catch(err) {
        console.log("Database ERROR :-> ",err.message);
    }
}
connectDB();
const app = express();
app.use(express.json())

app.use("/user/auth", userAuth)
app.use("/user", userRoute)
app.use("/PEG/auth",pegAuth)
app.use("/PEG/",pegRoute)
app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Listening on port: ${process.env.PORT || 5000}`)
})