const axios = require('axios')
const cheerio = require('cheerio')
const { Article } = require('../models')

module.exports = {
    
    // Scrape new articles from new york times
    async scrapeArticles() {
        const response = new Promise((resolve, reject) => {
            // Grab nytimes home page
            axios.get('https://www.nytimes.com/')
                .then(({ data: html }) => {
                    // Setup nytimes page to be scraped
                    const $ = cheerio.load(html)

                    $('a').each((i, elem) => {
                        // Grab properties for article
                        const href = $(elem).attr('href')
                        const category = href.split('/').filter((str, i, arr) => i === arr.length-2)[0]
                        const unique_name = 
                            href.split('/')
                                .filter((str, i, arr) => i === arr.length-1)[0]
                                .slice(0, -5)
                        const url = `https://www.nytimes.com${$(elem).attr('href')}`
                        const title = $(elem).children('div.esl82me1').children('h2.esl82me0').text()
                        const summary = $(elem).children('p.e1n8kpyg0').text()
                        // Make sure the article has a title, summary, and unique name
                        if (title && summary && unique_name) {
                            // Create article
                            Article.create({ title, summary, url, category, unique_name})
                                .then(data => console.log(data))
                                .catch(e => reject(e))
                        }
                    })
                    // Don't need to return anything
                    resolve()
                })
                .catch(e => reject(e))
        })

        return response
    }

}

