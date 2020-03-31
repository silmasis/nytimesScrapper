// require mongoose
const mongoose = require('mongoose')

// .env statement for heroku deployment
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/timesScraper"

module.exports = 
mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})