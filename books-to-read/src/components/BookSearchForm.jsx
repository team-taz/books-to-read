import { useState } from 'react'

function BookSearchForm({ onSubmit }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(query)
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <textarea
          className="search-input"
          placeholder="Type here"
          rows="3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="search-button"
        >
          Get Recommendations
        </button>
      </div>
    </form>
  )
}

export default BookSearchForm