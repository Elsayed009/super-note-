
const joi = require('joi');

const noteSchema = joi.object({
    title: joi.string().min(3).max(100).required(),
    content: joi.string().min(5).max(1500).required(),
    expiresAt: joi.date().allow(null)
});

const validateNote = (req, res, next)=>{
    const {error} = noteSchema.validate(req.body);
    if(error) return res.status(400).json({msg: error.details[0].message});
    next();
};

