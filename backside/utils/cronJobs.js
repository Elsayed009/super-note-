

const cron = require('node-cron');
const Note = require('../models/Note');

cron.schedule('0 * * * *', async ()=>{
    console.log('checking the expired notes...');
    try{
        const now = new Date();
        // بنورّ على الملاحظات اللي:
        // 1. لسه مش ممسوحة (isDeleted: false)
        // 2. ليها تاريخ انتهاء (expiresAt مش null)
        // 3. تاريخ انتهائها أصغر من أو يساوي "دلوقتي"
        const expiredNotes = await Note.updateMany(
            {
                isDeleted: false,
                expiresAt: {$ne: null, $lte: now}
            }, 
            {
                $set: {
                    isDeleted: true,
                    deleteAt: now
                }
            }
        );
        if (expiredNotes.modifiedCount > 0) {
            console.log(`the expired ${expiredNotes.modifiedCount} has been sent to the trash`);
        }
    }catch(err){
        console.log('error in the cleaning code', err.message);
    }
});


// mogoose returned obj content 
// {
//   acknowledged: true,
//   modifiedCount: 5,  // عدد الملاحظات اللي اتعدلت فعلاً
//   matchedCount: 5,   // عدد الملاحظات اللي انطبق عليها الشرط
//   upsertedId: null,
//   upsertedCount: 0
// }

// 3. نصيحة "سينيور":
// لو إنت في شركة كبيرة، حتى الـ console.error دي مش كفاية في الكرون جوب، بنستخدم حاجة اسمها Logging Service (زي Sentry أو Winston) بتبعت للمبرمج "إيميل" أو رسالة على "Slack" تقوله: "إلحق، سكريبت المسح التلقائي عطلان!"
