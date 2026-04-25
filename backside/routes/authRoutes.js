const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { validateRegister } = require('../middlewares/userValidator');

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.getsecurityQuestion);
router.post('/reset-password', authController.resetPassword);

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





