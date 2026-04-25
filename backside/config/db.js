
const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

const dbConnection= async()=> {
try{
    await mongoose.connect(url);
    console.log("database connected well");
}catch(err){
    console.log(err.message);
    // res.status(500).json({ 
    //     success: false, 
    //     message: "server error",
    //     error: err.message 
    // });
    process.exit(1);
    // Don't leave the client hanging
} 
};

module.exports = dbConnection;

