import express from 'express';
import cors from 'cors';
import { parseUserQuery } from './controllers/userQueryController.js';
import { queryOpenAIEmbedding, queryOpenAIChat } from './controllers/openaiController.js';
// import { queryPineconeDatabase } from './controllers/pineconeController.js';
// import { logQuery } from './controllers/logController.js'; // work in progress

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

app.post('/api',
  parseUserQuery, queryOpenAIEmbedding, queryOpenAIChat,
  (_req, res) => {
    res.status(200).json({
      movieRecommendation: res.locals.movieRecommendation
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