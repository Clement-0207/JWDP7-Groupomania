const express = require('express');
const router = express.Router();

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/:id/like', auth, commentCtrl.likeComment);
router.get('/', auth, commentCtrl.getAllComments);
router.get('/:id/like', auth, commentCtrl.getLike);
router.get('/:id', auth, commentCtrl.getOneComment);
router.post('/', auth, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);
router.put('/:id', auth, commentCtrl.modifyComment);

module.exports = router;