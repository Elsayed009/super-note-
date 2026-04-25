const express = require('express');
const router = express.Router();

// const {createNote, deleteNote, getActiveNotes, updateNote, shareNote, getPublicNote} = require('../controller/noteController');
const noteController = require('../controller/noteController')
const auth = require('../middlewares/auth');
const { validateNote } = require('../middlewares/validator');


// routes

router.get('/public/:shareId',noteController.getPublicNote);

router.post('/',auth, validateNote, noteController.createNote);

router.put('/:id',auth,validateNote, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);
router.patch('/share:id',auth, noteController.shareNote);
module.exports = router;


