// initialize with models
const { Article, Note } = require('../models')

// module.exports with routes pushing to index
module.exports = app => {

    // GET all notes
    app.get('/notes', (req, res) => {
        Note.find()
            .then(notes => res.json(notes))
            .catch(e => console.log(e))
    })

    // POST a note
    app.post('/notes', (req, res) => {
        Note.create(req.body)
            // Add note to article
            .then(note => 
                Article.updateOne({ _id: note.article }, { $push: { notes: note._id }}))
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

    // PUT a note
    app.put('/notes/:id', (req, res) => {
        Note.updateOne({ _id: req.params.id })
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

    // DELETE a note
    app.delete('/notes/:id', (req, res) => {
        Note.deleteOne({ _id: req.params.id })
            // Remove note from article
            .then(() => 
                Article.updateOne(
                    { _id: req.body.article }, 
                    { $pull: { notes: req.params.id }}
            ))
            .then(() => res.sendStatus(200))
            .catch(e => console.log(e))
    })

}