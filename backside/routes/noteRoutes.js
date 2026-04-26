const express = require('express');
const router = express.Router();

// const {createNote, deleteNote, getActiveNotes, updateNote, shareNote, getPublicNote} = require('../controller/noteController');
const noteController = require('../controller/noteController')
const auth = require('../middlewares/auth');
const { validateNote } = require('../middlewares/validator');
const track = require('../utils/tracker');

// routes
router.get('/', auth, track(noteController.getActiveNotes)); 
router.get('/public/:shareId',track(noteController.getPublicNote));

router.post('/',auth, validateNote, track(noteController.createNote));

router.put('/:id',auth,validateNote, track(noteController.updateNote));
router.delete('/:id', auth, track(noteController.deleteNote));
router.patch('/share/:id',auth, track(noteController.shareNote));
module.exports = router;


