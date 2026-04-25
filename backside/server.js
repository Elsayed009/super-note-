
//REQs

require('dotenv').config();
const express= require("express");
const cookieParser = require('cookie-parser');
const cors= require('cors');


const dbConnection = require('./config/db');
require('./utils/cronJobs');
const authRoutes = require('./routes/authRoutes');
const noteRoutes= require('./routes/noteRoutes');

// const mongoose= require('mongoose');
// const 
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // بورت الفرونت إند 
    credentials: true // مهم جداً عشان الـ Cookies (التوكن) تتبعت
}));


// mdellwarse
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
// routes 

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// call the dbConnection
dbConnection();



// test the server 
app.get('/', (req,res)=>{
    res.send("hello, we now open the app..");
});


// const url = process.env.MONGO_URL;
// db link

// async function dbConnection() {
    // try{
        //     await mongoose.connect(url);
        //     console.log("database connected well");
        // }catch(err){
            //     console.log(err.message);
            //     res.status(500).json({ 
                //         success: false, 
                //         message: "server error",
                //         error: err.message 
                //     });
                //     process.exit(1);
                //     // Don't leave the client hanging
                // } 
                // };
                
                
                
                
// make the sever work
const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`server work well on port: ${PORT} ` );
});




