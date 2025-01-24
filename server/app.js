import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseUserQuery } from './controllers/userQueryController.js';
import { queryOpenAIEmbedding, queryOpenAIChat } from './controllers/openaiController.js';
import { queryPineconeDatabase } from './controllers/pineconeController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
}));
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Hello from the backend!');
  });

app.post('/api/recommendations',
  parseUserQuery, queryOpenAIEmbedding, queryPineconeDatabase, queryOpenAIChat,
  (_req, res) => {
    res.status(200).json({
      bookRecommendation: res.locals.bookRecommendation
    });
  }
);
//queryPineconeDatabase

export const errorHandler = (err, _req, res, _next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};

app.use(errorHandler);

export default app;

//changed from CommonJS modules to ES modules