
const Note = require('../models/Note');
const User = require('../models/User');
const crypto = require('crypto');

const extractKeyWords = (content)=>{
  const stopWords = [
    
        //  arabic stoped words
        'في', 'من', 'على', 'الى', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ان', 'إن', 'او', 'أو', 'ثم', 'بعد', 'قبل', 'اللي', 'انا', 'هو', 'هي', 'و',
        // english stoped words 
        'the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'an', 'to', 'for', 'it', 'with', 'as', 'by', 'this', 'that', 'are', 'was', 'were', 'be', 'or', 'but'
    ];

const lowerCaseContent = content.toLowerCase();

const words = lowerCaseContent
.replace(/[.,/#!$%^&*;:{}=\-_`~()؟"']/g,"")
.split(/\s+/);

// filteration by itreate
const wordCount = {};
words.forEach(word=>{
  const cleanWord = word.trim(); // clean word from any speace   " "
  if(cleanWord.length> 2 && !stopWords.includes(cleanWord)) {
    wordCount[cleanWord] = (wordCount[cleanWord] || 0) +1; // we used [] with the obj cause the key is not const and is variable 
  }
});
  
// sort by dplicat
const sortedWords = Object.keys(wordCount).sort((a,b)=>wordCount[b] - wordCount[a]);


return sortedWords.slice(0,3);
};


// creat new notes

const createNote = async (req, res )=> {
  try{
    const {title, content, expiresAt} = req.body;
    const autoTags = extractKeyWords(content);

    const newNote = new Note({
      title,
      content,
      tags: autoTags,
      expiresAt: expiresAt || null,
      user: req.user.id
    });

    await newNote.save();

    // tracking logs 
    // const autoTags = extractKeyWords(content);
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        interests: {$each: autoTags}, 
        logs: {
          action: "created_note",
          details: `user created a note with tags: ${autoTags.join(', ')}`
        }
      }
    });

    res.status(201).json({msg: "note created", data: newNote});
  }catch(err){
    res.status(500).json({msg: "server erorr", data: err.message});
  }
};

// updateNote endpoint
const updateNote = async (req, res)=> {
  try{
    const {id}= req.params;
    const {title, content} = req.body;
    // const oldNote = await Note.findById(id);
    const oldNote = await Note.findOne({_id: id, user: req.user.id});
    //check
    if(!oldNote) return res.status(404).json({msg: "note is not founded"});

    const historyEntry = {
      content: oldNote.content,
      updatedAt: new Date()
    };

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title: title || oldNote.title,
        content: content || oldNote.content,
        tags: content? extractKeyWords(content): oldNote.tags,
        $push: {history: historyEntry}
      },
      {new: true}
    );

    res.status(200).json({msg: "note updated and history saved", data: updatedNote});

  }catch(err){
    res.status(500).json({msg: "server failed", error: err.message});
  }
}

// deletenote endpoint
const deleteNote = async (req, res)=> {
  try{
    const {id} =req.params;
    
    const updatedNote = await Note.findOneAndUpdate(
      {_id: id, user: req.user.id},
      {
        isDeleted: true,
        deleteAt: new Date()
      },
      {new: true}
    );
    if (!updatedNote){
      return res.status(404).json({msg: "note is not exists"});
    }
    res.status(200).json({msg: "note sent to the trash", data: updatedNote});
  }catch(err){
    res.status(500).json({msg: "server erorr", data: err.message});
  }
};

// getting data endpoint
const getActiveNotes = async (req, res) => {
  try{
    const notes = await Note.find({isDeleted: false, user: req.user.id}).sort({createdAt:-1});
    res.status(200).json(notes);

  }catch(err){
    res.status(500).json({msg: "server failed", error: err.message});
  }
};

// sharing endpoint 
const shareNote = async (req, res)=>{
  try{
    const {id} = req.params;
    const shareCode = crypto.randomBytes(5).toString('hex');

    const updatedNote = await Note.findOneAndUpdate(
      {_id: id, user: req.user.id, isDeleted: false},
      {shareId: shareCode},
      {new: true}
    );

    if(!updatedNote) return res.status(404).json({msg: "not founded or deleted"});
    // const shareLink = `http://localhost:5000/api/notes/public/${shareCode}`;
    const dynamicBaseUrl = `${req.protocol}://${req.get('host')}`;
    const shareLink = `${dynamicBaseUrl}/api/notes/public/${shareCode}`;
    
    res.status(200).json({msg: "sharing link is ready", link: shareLink});
  }catch(err){
    res.status(500).json({msg: "server error", error: err.message});
  }
}
// public shar link endpoint
const getPublicNote = async (req, res)=>{
   try{
      const {shareId} = req.params;
      const note = await Note.findOne({shareId, isDeleted: false});
      if (!note) return res.status(404).json({msg: "invalid link"});
      res.status(200).json({msg: "done", title: note.title, content: note.content});
  }catch(err){
    res.status(500).json({msg: "server error", error: err.message});
  }
}








module.exports = {createNote, deleteNote, getActiveNotes, updateNote, shareNote, getPublicNote};









// words.forEach(word => {
//         const cleanWord = word.trim();
        
//         if (cleanWord.length > 2 && !stopWords.includes(cleanWord)) {
            
//             // بداية الجزء البديل بالـ if/else
//             if (wordCount[cleanWord]) {
//                 // لو الكلمة موجودة فعلاً في المخزن، زود العداد بتاعها 1
//                 wordCount[cleanWord] = wordCount[cleanWord] + 1;
//             } else {
//                 // لو الكلمة أول مرة تظهر، حط قيمتها بـ 1
//                 wordCount[cleanWord] = 1;
//             }
//             // نهاية الجزء البديل
            
//         }
//     });




//     5. السطر "العبقري": wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
// ده أهم سطر، وهو اللي بيقوم بعملية الحساب كلها. تعال نفكه:

// wordCount[cleanWord]: إحنا هنا بننادي على مكان الكلمة جوه الـ Object. ليه استخدمنا [] مش .؟ لأن اسم الكلمة متغير (مرة أحمد، مرة محمد). لما يكون اسم الـ Key متغير، لازم نستخدم الأقواس المربعة [].

// الجزء (wordCount[cleanWord] || 0): ده بنسميه (Short-circuit evaluation).

// السيرفر بيروح يشوف: "يا wordCount هل عندك كلمة اسمها 'React'؟"

// لو لقاها، هياخد الرقم اللي عندها (مثلاً 1).

// لو ملهاش (أول مرة تظهر)، الـ Object هيرجع undefined (غير معرف). هنا بقى دور الـ || 0 (أو صفر). يعني لو ملقتهاش، اعتبر قيمتها صفر.

// الـ + 1: بعد ما حددنا القيمة القديمة (سواء كانت رقم موجود أو صفر)، بنزود عليها 1 ونخزنها تاني في نفس المكان.



// const generateSmartTags = (content)=>{
//     const tags = [];
//    if (content.includes('pay') || content.includes('supermarket') || content.includes('tomato'))
//      {tags.push('sells')};


//    return tags;
// }



// 2. ليه الصيغة دي Object.keys(wordCount)؟
// إحنا هنا بنعمل حاجة اسمها Static Method call.

// إحنا مش بننادي على wordCount.keys() (لأن الـ object بتاعك معندوش القدرة دي لوحده).

// إحنا بنبعت الـ Object بتاعنا "كهدية" للمصنع الكبير، وهو يفككه ويرجع لنا المصفوفة.

// 3. ليه عملنا كدة في مشروعنا؟
// عشان دالة الترتيب .sort() مبتشتغلش غير على المصفوفات (Arrays) بس.

// الـ wordCount بتاعنا هو "Object" (مينفعش يترتب لأن الـ Objects في جافا سكريبت ملهاش ترتيب ثابت).

// فكان لازم نحوله الأول لـ "Array" عشان نعرف نستخدم .sort() ونرتب الكلمات حسب مين اتكرر أكتر.



// const user = { name: "Ahmed", age: 25 };

// // لو عايز لستة بالأسماء (Keys):
// const keys = Object.keys(user); // النتيجة: ["name", "age"]

// // لو عايز لستة بالقيم (Values):
// const values = Object.values(user); // النتيجة: ["Ahmed", 25]






// automation selotions
// const generateSmartTags = (content) => {
//     const tags = [];
//     // القاموس بتاعنا (ممكن مستقبلاً نجيبه من قاعدة البيانات)
//     const dictionary = {
//         'مشتريات 🛒': ['شراء', 'سوبر ماركت', 'طماطم', 'لبن', 'بقالة'],
//         'عمل 💼': ['اجتماع', 'مدير', 'شغل', 'ايميل', 'تاسك'],
//         'دراسة 📚': ['مذاكرة', 'كورس', 'امتحان', 'كلية', 'ملزمة']
//     };

//     // الكود بيلف أوتوماتيك على القاموس
//     for (const [tag, keywords] of Object.entries(dictionary)) {
//         // لو لقى أي كلمة من الكلمات المفتاحية جوه المحتوى، بيضيف التاج
//         if (keywords.some(keyword => content.includes(keyword))) {
//             tags.push(tag);
//         }
//     }
//     return tags;
// };







// 4. التجهيز للإعلانات (The Ads Strategy)
// دلوقتي لما تيجي تعمل API للإعلانات، هتعمل Query بسيط:

// تجيب أكتر 5 كلمات متكررة في user.interests.

// تبعت الكلمات دي لـ API إعلانات (أو قاعدة بيانات إعلانات عندك) وتجيب اللي يناسبهم.

// مثال: لو اهتماماته فيها كلمة "gym" كتير -> اظهر له إعلان بروتين.