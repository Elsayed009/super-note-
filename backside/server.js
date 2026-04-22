
//REQs

require('dotenv').config();
const express= require("express");
const cors= require('cors');
const mongoose= require('mongoose');


const noteRoutes= require('./routes/noteRoutes');

const app = express();


// mdellwarse
app.use(cors());
app.use(express.json());

// routes 
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 4000;
const url = process.env.MONGO_URL;
// db link
async function dbConnection() {
try{
    await mongoose.connect(url);
    console.log("database connected well");
}catch(err){
    console.log(err.message);
    res.status(500).json({ 
        success: false, 
        message: "server error",
        error: err.message 
    });
    process.exit(1);
    // Don't leave the client hanging
} 
}

// call the dbConnection
dbConnection();


// test the server 
app.get('/', (req,res)=>{
    res.send("hello, we now open the app..");
});


// make the sever work
app.listen(PORT, ()=>{
    console.log(`server work well on port: ${PORT} ` );
})




