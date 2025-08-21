const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;