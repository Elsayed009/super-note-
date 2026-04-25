const jwt = require('jsonwebtoken');
const scrtKey = process.env.JWT_SECRET;



module.exports = (req, res, next)=> {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({msg: "unauthoraized, please login"});
    try {
        const decoded = jwt.verify(token, scrtKey);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({msg: "invalid token"});
    }
};