import { Pinecone } from '@pinecone-database/pinecone';

// Initialize once and export for reuse
console.log('API Key:', process.env.PINECONE_API_KEY);
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
  });
const booksIndex = pinecone.index('books');

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
    const queryResponse = await booksIndex.query({
    vector: embedding,     // The embedding vector we want to search for
    topK: 2,              // How many closest matches we want returned
    includeMetadata: true // Whether we want the metadata for each match
});

    // Store the query results in res.locals
    console.log('Pinecone Query Response:', {
        matchCount: queryResponse.matches.length,
        firstMatchScore: queryResponse.matches[0]?.score,
        firstMatchMetadata: queryResponse.matches[0]?.metadata
    });
    res.locals.pineconeQueryResult = queryResponse.matches.map(match => ({
        score: match.score,
        metadata: match.metadata,
        id: match.id
    }));
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
