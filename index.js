const express=require("express");
const multer=require("multer");
const fs=require("fs");
const csvParser=require("csv-parser");
const pool=require("./db");
const cors =require('cors');
const bodyParser =require("body-parser");


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(bodyParser.json());
const upload=multer({ dest: "userData/" });
const eventData=multer({ dest: "eventData/" });
const holidayData=multer({ dest: "holidayData/" });



app.post("/userData",upload.single("csv"), async(req, res)=>{
    const filepath=req.file.path;

try{
    const client=await pool.connect();
    const result =[];
    fs.createReadStream(filepath)
    .pipe(csvParser())
    .on("data",row => {
        result.push(row);
    })
    .on("end", async () =>
    {
        const query = 'INSERT INTO "userData" ("firstname", "lastname", "email", "phone", "address", "empid", "Pan", "bloodgroup", "dob", "dateofjoining", "location", "director", "CM", "CEO", "HR", "primaryskill", "secondaryskill", "CL", "Sick", "PR", "Emergencyname", "Contactno", "gender", "Desc1", "Desc2", "TeamName", "teamLead", "teamManager", "password", "confirmpassword") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21,  $22,  $23, $24, $25, $26, $27, $28, $29, $30)';
        await Promise.all(
            result.map(async row => {
            const { firstname, lastname, email, phone, address, empid, Pan, bloodgroup, dob, dateofjoining, location, director, CM, CEO, HR, primaryskill, secondaryskill, CL, Sick, PR, Emergencyname, Contactno, gender, Desc1, Desc2,TeamName, teamLead, teamManager, password, confirmpassword}= row;
            const value = [firstname, lastname, email, phone, address, empid, Pan, bloodgroup, dob, dateofjoining, location, director, CM, CEO, HR, primaryskill, secondaryskill, CL, Sick, PR, Emergencyname, Contactno, gender, Desc1, Desc2,TeamName, teamLead, teamManager, password, confirmpassword];
            await client.query(query, value);
            })
        );
        client.release();
        console.log("upload sucessfully");
     });
    }
    catch(error)
    {
        console.error("my error",error);
    }
});
app.post("/holidayList",holidayData.single("csv"), async(req, res)=>{
    const filepath=req.file.path;

try{
    const client=await pool.connect();
    const result =[];
    fs.createReadStream(filepath)
    .pipe(csvParser())
    .on("data",row => {
        result.push(row);
    })
    .on("end", async () =>
    {
        const query = 'INSERT INTO "holidayList" ("Date", "Holiday", "Remark") VALUES ($1, $2, $3)';
        await Promise.all(
            result.map(async row => {
            const { Date, Holiday, Remark}= row;
            const value = [Date, Holiday, Remark];
            await client.query(query, value);
            })
        );
        client.release();
        console.log("upload sucessfully");
     });
    }
    catch(error)
    {
        console.error("my error",error);
    }
})
app.post("/event",eventData.single("csv"), async(req, res)=>{
    const filepath=req.file.path;

try{
    const client=await pool.connect();
    const result =[];
    fs.createReadStream(filepath)
    .pipe(csvParser())
    .on("data",row => {
        result.push(row);
    })
    .on("end", async () =>
    {
        const query = 'INSERT INTO "eventData" ("Date","Eventname","meetingLink") VALUES ($1, $2, $3)';
        await Promise.all(
            result.map(async row => {
            const { Date, Eventname, meetingLink}= row;
            const value = [Date, Eventname, meetingLink];
            await client.query(query, value);
            })
        );
        client.release();
        console.log("upload sucessfully");
     });
    }
    catch(error)
    {
        console.error("my error",error);
    }
});
app.post("/hoursHistory", async(req, res)=>{
    const {firstname,email,phone,empid,project,Activty,Day1,Day2,Day3,Day4,Day5,Total,Leave,leavedate,reason,status,approver,datefrom,dateto,leaveHour}= req.body;

try{
    const client=await pool.connect();
     console.log(req.body);
        const query = 'INSERT INTO "Hoursdetails"("firstname","email","phone","empid","project","Activty","Day1","Day2","Day3","Day4","Day5","Total","Leave","leavedate","reason","status","approver","datefrom","dateto","leaveHour") VALUES ($1, $2, $3,$4, $5, $6,$7, $8, $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)';
        const value = [firstname,email,phone,empid,project,Activty,Day1,Day2,Day3,Day4,Day5,Total,Leave,leavedate,reason,status,approver,datefrom,dateto,leaveHour];
        //  console.log("value",value);
            const result =  await client.query(query, value);

            // console.log("result",result.rows);
            res.send(result.rows); 
        client.release();
        console.log("upload sucessfully");
     
    }
    catch(error)
    {
        console.error("my error",error);
    }
});
app.get("/employee/:email/:password", async (req,res)=>
{
    const { email,password }=req.params;
   const client =await pool.connect();
   try{
    const query='SELECT * FROM "userData" where "email"=$1 AND "password"=$2'
    const values=[ email,password ];
    const result=await client.query(query,values);
    res.send(result.rows[0]);
    console.log("login success",result.rows);
   }
  catch(error)
  {
    res.send(error);
  }
finally
{
    client.release();
}
})
app.get("/getAllevent", async (req,res)=>
    {
       const client =await pool.connect();
       try{
        const query='SELECT * FROM "eventData"'
        const result=await client.query(query);
        res.send(result.rows);
        console.log("event",result.rows);
       }
      catch(error)
      {
        res.send(error);
      }
    finally
    {
        client.release();
    }
    })
    app.get("/getAllholiday", async (req,res)=>
        {
           const client =await pool.connect();
           try{
            const query='SELECT * FROM "holidayList"'
            const result=await client.query(query);
            res.send(result.rows);
            console.log("event",result.rows);
           }
          catch(error)
          {
            res.send(error);
          }
        finally
        {
            client.release();
        }
        })
    app.get("/getALLHours/:firstname", async (req,res)=>
        {
            const firstName=req.params.firstname
            console.log(firstName,"firstName");
           const client =await pool.connect();
           try{
            const query='SELECT * FROM "Hoursdetails" WHERE "firstname"=$1'
            const value = [firstName];
            const result=await client.query(query,value);
            res.send(result.rows);
            console.log("event",result.rows);
           }
          catch(error)
          {
            res.send(error);
          }
        finally
        {
            client.release();
        }
        })
        app.get("/getrefer/:firstname", async (req,res)=>
            {
                const firstName=req.params.firstname
               const client =await pool.connect();
               try{
                const query='SELECT * FROM "referDB" WHERE "referedBy"=$1'
                const value = [firstName];
                const result=await client.query(query,value);
                res.send(result.rows);
                console.log("event",result.rows);
               }
              catch(error)
              {
                res.send(error);
              }
            finally
            {
                client.release();
            }
            })
        app.post("/refer", async(req,res) =>
            {
                // console.log(req);
                const {firstname, middlename, lastname, email, contact, phone, experience, skill, resume, referedBy, referedbyempId} =req.body;
                console.log(req.body);
                try{
                    const client =await pool.connect();
                    // let insertQuery = `insert into myuser(firstname,lastnam,email,phone,pass,retypepas,dob,gender, gstno, bussinessname, role, userage, otp) values('${}','${myuser.name}','${myuser.email}','${myuser.address}','${myuser.password}','${myuser.retypepassword}')`
            
                    const query='INSERT INTO "referDB" ("firstname", "middlename", "lastname", "email", "contact", "phone", "experience", "skill", "resume", "referedBy", "referedbyempId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
                    const values=[firstname, middlename, lastname, email, contact, phone, experience, skill, resume, referedBy, referedbyempId];
                    const result = await client.query(query,values);
                    console.log("value",values);
                    res.send(result.rows); 
                    console.log("upload sucessfully");
                    client.release();
                   }
                   catch (error) {
                    console.error('Error executing query', error);
                    res.status(500).send('Internal Server Error');
                } 
            });
    
app.listen(3000, ()=>
{
    console.log("my port run");
});
