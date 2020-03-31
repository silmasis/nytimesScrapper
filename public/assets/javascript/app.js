// Helper function to display articles
const updateArticleList = isSaved => {
  // Grab articles that are saved or not depending on the parameter isSaved
  axios.get(`/${isSaved ? '' : 'un'}saved_articles`)
    .then(({ data: articles }) => {
      // First clear display
      document.getElementById('articleContainer').innerHTML = ''
      // Make sure there are articles
      if (articles.length > 0) {
        articles.forEach(article => {
          document.getElementById('articleContainer').innerHTML += `
            <div class="card mb-4 articleCards">
              <h5 class="card-header danger-color text-white h5">${article.title}</h5>
              <div class="card-body">
                <p class="card-text">${article.summary}</p>
                ${
            // Change buttons on card depending on
            // whether the client is on the index
            // page or the saved page
            isSaved
              ? `
                    <a href="#!" class="btn btn-elegant btn-lg deleteArticleBtn" data-id=${article._id}>
                      Delete Saved Article
                      <i class="fas fa-trash-alt ml-2" aria-hidden="true"></i>
                    </a>
                    <button type="button" class="btn btn-elegant btn-lg noteBtn" data-toggle="modal" data-target="#notesModal" data-id=${article._id}>
                      Notes
                      <i class="far fa-sticky-note ml-2" aria-hidden="true"></i>
                    </button>
                    `
              : `
                    <a href="#!" class="btn btn-elegant btn-lg saveBtn" data-id=${article._id}>
                      Save Article
                      <i class="fas fa-heart ml-2" aria-hidden="true"></i>
                    </a>
                  `
            }
              </div>
            </div>`
        })
      } else {
        // If no articles then display empty card
        document.getElementById('articleContainer').innerHTML = `
          <div class="card mb-4 articleCards danger-color">
            <h5 class="card-header text-white h5">SCRAPE ARTICLES</h5>
          </div>
        `
      }
    })
    .catch(e => console.error(e))
}

// Helper function to display notes in modal
const updateNoteList = article => {
  const noteList = document.getElementById('noteList')
  // Reset noteList to empty
  noteList.innerHTML = ''
  // Check if notes exist and contains at least one note
  if (article.notes && article.notes.length > 0) {
    // Add a list group item for each note
    article.notes.forEach(note => {
      noteList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
          <span>${note.body}</span>
          <button class="deleteNoteBtn" type="button" data-id=${note._id}>
            <span class="text-danger deleteNote" aria-hidden="true" data-id=${note._id}>×</span>
          </button>
        </li>`
    })
  } else {
    // Client needs to add notes if no notes exist
    noteList.innerHTML += `
      <li class="list-group-item danger-color">
        <span class="text-white">ADD NOTES</span>
      </li>`
  }
}

// Event Listeners
document.addEventListener('click', e => {

  // Scrape more articles
  if (e.target.id === 'scrapeBtn') {
    axios.get('/scrapes')
      .then(() => updateArticleList(false))
      .catch(e => console.error(e))
  }

  // Save article
  if (e.target.classList.contains('saveBtn')) {
    axios.put(`/articles/${e.target.dataset.id}`, { isSaved: true })
      .then(() => updateArticleList(false))
      .catch(e => console.error(e))
  }

  // Clear unsaved articles
  if (e.target.id === 'clearBtn') {
    axios.delete('/articles', { isSaved: false })
      .then(() => updateArticleList(false))
      .catch(e => console.error(e))
  }

  // Delete saved article
  if (e.target.classList.contains('deleteArticleBtn')) {
    axios.delete(`/articles/${e.target.dataset.id}`)
      .then(() => updateArticleList(true))
      .catch(e => console.error(e))
  }

  // Show notes for article
  if (e.target.classList.contains('noteBtn')) {
    document.getElementById('noteList').dataset.id = e.target.dataset.id
    axios.get(`/articles/${e.target.dataset.id}`)
      .then(({ data: [article] }) => updateNoteList(article))
      .catch(e => console.error(e))
  }

  // Delete note
  if (e.target.classList.contains('deleteNote')) {
    // Grab article _id
    const article = document.getElementById('noteList').dataset.id
    axios.delete(`/notes/${e.target.dataset.id}`, { article })
      // Once note is deleted, update note list 
      .then(() => axios.get(`/articles/${article}`))
      .then(({ data: [article] }) => updateNoteList(article))
      .catch(e => console.error(e))
  }

  // Add note but only if the user entered text into noteTextArea
  if (e.target.classList.contains('addNoteBtn') && document.getElementById('noteTextArea').value) {
    // Reset noteTextArea
    const body = document.getElementById('noteTextArea').value
    document.getElementById('noteTextArea').value = ''
    // Grab article _id
    const article = document.getElementById('noteList').dataset.id
    axios.post('/notes', { body, article })
      // Once note is added, update note list
      .then(() => axios.get(`/articles/${article}`))
      .then(({ data: [article] }) => updateNoteList(article))
      .catch(e => console.error(e))
  }

})

// Initial article display for index.html and saved.html
if (window.location.href.includes('saved')) {
  // saved.html
  updateArticleList(true)
} else {
  // index.html
  updateArticleList(false)
}