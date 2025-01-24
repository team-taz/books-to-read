import { useState } from 'react'
import BookSearchForm from '../components/BookSearchForm'

function App() {
  const [recommendations, setRecommendations] = useState(null)

  const handleSearch = (data) => {
    // Parse the recommendation string into a more structured format
    const recommendationText = data.bookRecommendation
    // Split into individual book recommendations
    const books = recommendationText
      .split(/\d\./)  // Split on number followed by period
      .slice(1)       // Remove the initial empty string
      .map(book => {
        // Extract title and author
        const match = book.match(/"([^"]+)" by ([^:(\n]+)/)
        if (match) {
          return {
            title: match[1],
            author: match[2].trim(),
            description: book.split(':')[1]?.trim() || ''
          }
        }
        return null
      })
      .filter(Boolean)  // Remove any null entries

    setRecommendations(books)
  }

  return (
    <div className="page-background">
      <div className="page-overlay">
        <div className="content-container">
          <header className="page-header">
            <h1 className="page-title">
              Welcome to Book Match
            </h1>
            <p className="page-subtitle">
              Ready to read?
            </p>
            <p className="helper-text">
              Share your reading preferences for personalized recommendations. This can include genre, profession/industry, skills you hope to improve, etc.
            </p>
          </header>

          <div className="search-container">
            <BookSearchForm onSubmit={handleSearch} />

            {recommendations && (
              <div className="recommendations-container">
                <h2 className="recommendations-title">
                  Your Recommended Books
                </h2>
                <ul className="recommendations-list">
                {recommendations.map((book, index) => (
                    <li
                      key={index}
                      className="recommendation-item"
                    >
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      <p className="book-description">{book.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App