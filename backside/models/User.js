const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    securityQuestion: { 
        type: String,
         required: true
    },
    securityAnswer: {
         type: String,
          required: true
    },
    interests: [{
        type: String
    }],
    logs:[{
        action: String,
        details: String,
        at: {type: Date, default: Date.now}
    }]
}, {timestamps: true});

 const User = mongoose.model("User", userSchema);
 module.exports = User;