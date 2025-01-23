import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

// Initialize once and export for reuse
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT // You should add this
  });
const booksIndex = pineconeClient.index('books');

export const queryPineconeDatabase = async (
req,
res,
next
) => {
const embedding = res.locals.embedding;
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
    const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
    });
    const index = pc.index('books');

    const queryResponse = await index.query({
    vector: embedding,     // The embedding vector we want to search for
    topK: 2,              // How many closest matches we want returned
    includeMetadata: true // Whether we want the metadata for each match
});

    // Store the query results in res.locals
    console.log('queryResponse:', queryResponse);
    res.locals.pineconeQueryResult = queryResponse.matches;
    return next();

    } catch (err) {
    const error  = {
    log: `queryPineconeDatabase: ${err}`,
    status: 500,
    message: { err: 'An error occurred while querying database' },
    };
    return next(error);
}
};