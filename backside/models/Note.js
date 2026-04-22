const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
title: {
    type: String,
    required: true
},
content: {
    type: String,
    required: true
},
expiresAt: {
    type: Date,
    default: null
},
isDeleted: {
    type: Boolean, 
    default: false
},
deleteAt: {
    type: Date,
    default: null
},
tags: [{type: String}],
history: [{
    content: String,
    modifiedAt: {type: Date, default: Date.now}
}], 
shareId: {type: String, unique: true, sparse: true}

}, {timestamps: true});

const Note= mongoose.model('Note', noteSchema);
module.exports = Note;