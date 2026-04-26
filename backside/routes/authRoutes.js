const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { validateRegister } = require('../middlewares/userValidator');
const auth = require('../middlewares/auth');
const track = require('../utils/tracker');


// non wraped endpoints cause user is still undefined 
router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.getsecurityQuestion);
router.post('/reset-password', authController.resetPassword);

// portected endpoints so we can wrapped it
router.post('/logout', track(authController.logout));
router.delete('/delete-account', auth, track(authController.deleteAccount));
router.get('/logs', auth, track(authController.getUserLogs));
module.exports = router;















// const errorHandler = (err, req, res, next) => {
//     console.error("🚨 Error Caught by Global Handler:", err.message);

//     // لو الخطأ جاي من Mongoose (زي إن الداتا ناقصة أو متكررة)
//     if (err.name === 'ValidationError') {
//         return res.status(400).json({ msg: "بيانات غير صالحة", details: err.message });
//     }
    
//     if (err.code === 11000) {
//         return res.status(400).json({ msg: "هذه البيانات (مثل الإيميل) مسجلة بالفعل" });
//     }

//     // أي خطأ تاني غير متوقع
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode).json({
//         msg: "حدث خطأ في الخادم",
//         error: process.env.NODE_ENV === 'development' ? err.message : "Internal Server Error"
//     });
// };

// module.exports = errorHandler;





