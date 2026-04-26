

const { date } = require('joi');
const User = require('../models/User');

const logAction = async (userId, actionName)=>{
    try{
        await User.findByIdAndUpdate(userId, {
            $push: {logs: {action: actionName, date: new Date()}}
        });
    }catch(err){
        console.log("errorr saving lgo: ", err.message);
    }
};

module.exports = logAction;
