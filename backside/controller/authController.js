const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

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

        res.status(201).json({msg: 'user created successfully', dat: newUser});
    }catch(err){
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
        res.status(500).json({msg: "server dawn", error: err.message});
    }
};

// log out endpoint
const logout = (req, res)=>{
    res.clearCookie('token').json({msg: "loged out successfully"});
}

// securityQuestion
const getsecurityQuestion = async (req, res, next)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({msg: "user not founded"});

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
        if(!isAnswerCorrect) return res.status(400).json({msg: "security answer is not correct"});

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({msg: "password has been reseted, you can login again now.."});

    }catch(err){
        res.status(500).json({msg: "server dawn", error: err.message});
    }
}

module.exports = {register, login, logout, getsecurityQuestion, resetPassword};