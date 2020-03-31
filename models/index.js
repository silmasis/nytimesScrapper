// using mongoose
const { model, Schema } = require('mongoose')

// const require statements for models (model, Schema)
const Article = require('./Article')(model, Schema)
const Note = require('./Note')(model, Schema)

// module.exports = { ~models~ }
module.exports = { Article, Note }