// initialize with models
const { Article } = require('../models')

// module.exports with routes pushing to index
module.exports = app => {

    // GET all unsaved articles 
    app.get('/unsaved_articles', (req, res) => {
        Article.find({ isSaved: false })
            .then(articles => res.json(articles))
            .catch(e => console.log(e))
    })

    // GET all saved articles
    app.get('/saved_articles', (req, res) => {
        Article.find({ isSaved: true })
            .then(articles => res.json(articles))
            .catch(e => console.log(e))
    })

    // GET one article
    app.get('/articles/:id', (req, res) => {
        Article.find({ _id: req.params.id })
            .populate('notes')
            .then(article => res.json(article))
            .catch(e => console.log(e))
    })

    // POST one article
    app.post('/articles', (req, res) => {
        Article.create(req.body)
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

    // PUT one article
    app.put('/articles/:id', (req, res) => {
        Article.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

    // DELETE saved or unsaved articles
    app.delete('/articles', (req, res) => {
        Article.deleteMany({ isSaved: req.body.isSaved })
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

    // DELETE one article
    app.delete('/articles/:id', (req, res) => {
        Article.deleteOne({ _id: req.params.id })
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

}