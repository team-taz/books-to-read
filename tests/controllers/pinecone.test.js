import { describe, it, expect, vi, beforeEach } from 'vitest';
import { queryPineconeDatabase } from '../../server/controllers/pineconeController';

// Mock the Pinecone client
vi.mock('@pinecone-database/pinecone', () => {
  return {
    Pinecone: vi.fn(() => ({
      index: vi.fn(() => ({
        query: vi.fn().mockResolvedValue({
          matches: [{
            id: '1',
            score: 0.95,
            metadata: {
              title: 'Test Book',
              year: 2024,
              plot: 'A test plot summary'
            }
          }]
        })
      }))
    }))
  };
});

describe('Pinecone Controller', () => {
  // Set up fresh mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully query Pinecone database with valid embedding', async () => {
    // Arrange: Set up test data
    const req = {};
    const res = {
      locals: {
        embedding: new Array(1536).fill(0.1) // Mock embedding vector
      }
    };
    const next = vi.fn();

    // Act: Call the function we're testing
    await queryPineconeDatabase(req, res, next);

    // Assert: Check the results
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();  // Called without error
    expect(res.locals.pineconeQueryResult).toBeDefined();
    expect(res.locals.pineconeQueryResult[0].metadata.title).toBe('Test Book');
  });

  it('should handle missing embedding error', async () => {
    // Arrange: Set up test data without embedding
    const req = {};
    const res = { locals: {} };
    const next = vi.fn();

    // Act: Call the function we're testing
    await queryPineconeDatabase(req, res, next);

    // Assert: Check error handling
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        message: expect.objectContaining({
          err: 'An error occurred before querying the database'
        })
      })
    );
  });
});