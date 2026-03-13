const express = require('express');
const router = express.Router();

const {
  getNotes,
  getNote,
  postNote,
  updateNote,
  deleteNote
} = require('../controllers/notes');

router.get('/', getNotes);
router.post('/', postNote);

router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;