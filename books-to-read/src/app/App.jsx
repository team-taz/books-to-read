import { useState } from 'react'
import BookSearchForm from '../components/BookSearchForm'

function App() {
  const [recommendations, setRecommendations] = useState(null)

  const handleSearch = (query) => {
    // Placeholder for API call
    setRecommendations([
      "The Midnight Library by Matt Haig",
      "Atomic Habits by James Clear",
      "Project Hail Mary by Andy Weir"
    ])
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
                      {book}
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