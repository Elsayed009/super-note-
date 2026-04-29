

const { date } = require('joi');
const User = require('../models/User');

const logAction = async (userId, actionName, details= "")=>{
    try{
        await User.findByIdAndUpdate(userId, {
            $push: {logs: {action: actionName, details: details, at: new Date()}}
        });
    }catch(err){
        console.log("error saving lgo: ", err.message);
    }
};

module.exports = logAction;
