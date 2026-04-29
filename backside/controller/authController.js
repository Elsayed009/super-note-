const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Note = require('../models/Note');
const logAction = require('../utils/logger');
// the endpoints 
const register = async (req, res)=> {
    try{
        const {username, password, email, securityQuestion, securityAnswer}= req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(409).json({msg: "this email is already existes"});

        // hassing password 
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), 10);

        const newUser = new User({
            username,
            email,
             password: hashedPassword,
            securityQuestion,
            securityAnswer: hashedAnswer
        });
        await newUser.save(); // go get it and await it to be geted and save it
        await logAction(newUser._id, "Register", "User created a new account");
        res.status(201).json({msg: 'user created successfully', dat: newUser});
    }catch(err){
        if (typeof newUser !== 'undefined' && newUser && newUser._id) {
            await User.findByIdAndDelete(newUser._id); // "إنسى إني سجلتك"
            console.log("Rollback: User deleted because tracking failed.");
        }
        res.status(500).json({msg: "server dawn", error: err.message});
    }
};

// login endpoint

const login = async (req, res)=> {
    try{
        const {email, password}= req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({msg: "user not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: 'invalid credentails'});
        // logs 
        // user.logs.push({action: "user logged in", date: new Date()});
        // await user.save();
        await logAction(user._id, "Login", "User logged in successfully");
        // creat token 
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d" });
            // send token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // when u deploy the saas mk it true
                maxAge: 24*60*60*1000
            }).json({
                msg: "logged in successfully",
                user: {username: user.username,
                     email: user.email}});

    }catch(err){
        res.status(500).json({msg: "server down", error: err.message});
    }
};

// log out endpoint
// const logout = (req, res)=>{
//     res.clearCookie('token').json({msg: "loged out successfully"});
// }
const logout = async (req, res) => {
    try {

        if(req.user && req.user.id){
            await logAction(req.user.id, "Logout", "User logged out of the system")
        }
        res.clearCookie('token');
        res.status(200).json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

// securityQuestion
const getsecurityQuestion = async (req, res, next)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({msg: "user not founded"});
        await logAction(user._id, "getsecurityQuestion");
        res.status(200).json({question: user.securityQuestion});

    }catch(err){
        res.status(500).json({msg: "server dawn", error: err.message});
    }
};

const resetPassword = async (req, res, next)=>{
    try{
        const {email, securityAnswer, newPassword}= req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({msg: "user not founded"});

        const isAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase(), user.securityAnswer);
        if(!isAnswerCorrect) {
            logAction(user._id, "Security Warning", "Failed password reset attempt (Incorrect Security Answer)")
            return res.status(400).json({msg: "security answer is not correct"});}

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        await logAction(user._id, "Reset Password", "Password has been successfully reset");
        res.status(200).json({msg: "password has been reseted, you can login again now.."});

    }catch(err){
        res.status(500).json({msg: "server dawn", error: err.message});
    }
};

// delete acc endpoint
const deleteAccount = async (req, res)=>{
     try{
      const userId = req.user.id;
      await Note.deleteMany({user: userId});
      await User.findByIdAndDelete(userId);

      res.clearCookie('token');
      res.status(200).json({msg: "account and all its related notes deleted successfully"});
    }catch(err){
        res.status(500).json({msg: "server dawn", error: err.message});
    }
};


// logs endpoint
const getUserLogs= async (req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('logs');
        if (!user) return res.status(404).json({msg: "user not founded"});

        await logAction(req.user.id, "View Activity", "Viewed account activity logs");
        const sortedLogs = user.logs.sort((a,b) =>b.at - a.at);
        res.status(200).json({msg: "logs retrieved successfully", logs: sortedLogs});

    }catch(err){
        res.status(500).json({msg: "server error", error: err.message});
    }
};


module.exports = { register, login, logout, getsecurityQuestion, resetPassword, deleteAccount, getUserLogs };