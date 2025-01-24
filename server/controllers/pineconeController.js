import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import process from 'process';

// Initialize once and export for reuse
// console.log(process.env.PINECONE_API_KEY);
const pineconeClient = new Pinecone({
  // apiKey: process.env.PINECONE_API_KEY,
  apiKey:
    'pcsk_7YCXK3_DEjJTNGeiihVaA4dz3MRzX9Yo1H1z9PdLa5G9WGs23uQzkQi65SJgh4dnnZLELp',
  // environment: process.env.PINECONE_ENVIRONMENT, // You should add this
});
const booksIndex = pineconeClient.index('books');

export const queryPineconeDatabase = async (req, res, next) => {
  console.log('START');
  const embedding = res.locals.embedding;
  console.log(embedding);
  if (!embedding) {
    const error = {
      log: 'Database query middleware did not receive embedding',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  // Query Pinecone with the embedding
  try {
    const queryResponse = await booksIndex.query({
      vector: embedding, // The embedding vector we want to search for
      topK: 2, // How many closest matches we want returned
      includeMetadata: true, // Whether we want the metadata for each match
    });

    // Store the query results in res.locals
    console.log('queryResponse:', queryResponse);
    res.locals.pineconeQueryResult = queryResponse.matches;
    return next();
  } catch (err) {
    const error = {
      log: `queryPineconeDatabase: ${err}`,
      status: 500,
      message: { err: 'An error occurred while querying database' },
    };
    return next(error);
  }
};
