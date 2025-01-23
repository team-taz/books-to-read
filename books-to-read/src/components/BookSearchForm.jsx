import { useState } from 'react'

function BookSearchForm({ onSubmit }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      onSubmit(data)
    } catch (err) {
      setError('Failed to get recommendations. Please try again.')
      console.error('Error fetching recommendations:', err)
    } finally {
      setIsLoading(false)
    }
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
          disabled={isLoading}
        />
        <button
          type="submit"
          className="search-button"
          disabled={isLoading}
        >
          {isLoading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </button>
      </div>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </form>
  )
}

export default BookSearchForm