const express = require('express');
const router = express.Router();

const {createNote, deleteNote, getActiveNotes, updateNote} = require('../controller/noteController');


// routes

router.post('/', createNote);
router.get('/', getActiveNotes);
router.patch('/:id/delete', deleteNote);
router.put('/:id', updateNote);
module.exports = router;


