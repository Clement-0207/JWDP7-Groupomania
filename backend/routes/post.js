const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/:id/like', auth, postCtrl.likePost);
router.get('/', auth, postCtrl.getAllPost);
router.get('/:id/like', auth, postCtrl.getLike);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.put('/:id', auth, postCtrl.modifyPost);

module.exports = router;