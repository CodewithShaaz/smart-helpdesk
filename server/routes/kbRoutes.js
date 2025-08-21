const express = require('express');
const router = express.Router();
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/kbController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createArticle).get(getArticles);
router.route('/:id').get(getArticleById).put(protect, admin, updateArticle).delete(protect, admin, deleteArticle);

module.exports = router;