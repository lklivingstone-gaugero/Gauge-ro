import pg from "pg";
const { Pool } = pg;

const client = new Pool({
      host: '142.93.217.188',
      user: 'postgres',
      port: 5432,
      password: "secrectplus",
      database: "TEST"
});

client.connect()

// console.log("Connected")

// client.query("SELECT * from testing", (err, res)=>{
//       if (!err) {
//             console.log(res.rows)
//       } else {
//             console.log(err.message)
//       }
// })

export default client