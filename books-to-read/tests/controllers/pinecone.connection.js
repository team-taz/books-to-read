import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});
const index = pc.index('books');

// Create 1536-dim vector with random values
const vector1536 = Array.from({length: 1536}, () => Math.random());

await index.namespace('ns1').upsert([
    {
       id: 'vec1', 
       values: vector1536,
       metadata: { genre: 'drama' }
    }
]);

const response = await index.namespace('ns1').query({
    topK: 2,
    vector: vector1536,
    includeValues: true,
    includeMetadata: true,
    filter: { genre: { '$eq': 'action' }}
});

console.log(response);