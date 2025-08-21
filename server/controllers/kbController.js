const Article = require('../models/articleModel');

// @desc    Create an article
// @route   POST /api/kb
const createArticle = async (req, res) => {
  const { title, body, tags, status } = req.body;
  const article = new Article({ title, body, tags, status });
  const createdArticle = await article.save();
  res.status(201).json(createdArticle);
};

// @desc    Get all articles with search
// @route   GET /api/kb
const getArticles = async (req, res) => {
  const keyword = req.query.query
    ? {
        $or: [
          { title: { $regex: req.query.query, $options: 'i' } },
          { body: { $regex: req.query.query, $options: 'i' } },
          { tags: { $regex: req.query.query, $options: 'i' } },
        ],
      }
    : {};
  const articles = await Article.find({ ...keyword, status: 'published' });
  res.json(articles);
};

// @desc    Get an article by ID
// @route   GET /api/kb/:id
 const getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
};

// @desc    Update an article
// @route   PUT /api/kb/:id
const updateArticle = async (req, res) => {
  const { title, body, tags, status } = req.body;
  const article = await Article.findById(req.params.id);

  if (article) {
    article.title = title || article.title;
    article.body = body || article.body;
    article.tags = tags || article.tags;
    article.status = status || article.status;

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
};

// @desc    Delete an article
// @route   DELETE /api/kb/:id
const deleteArticle = async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article) {
        await article.deleteOne();
        res.json({ message: 'Article removed' });
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
};

module.exports = { createArticle, getArticles, getArticleById, updateArticle, deleteArticle };