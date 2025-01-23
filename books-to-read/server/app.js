import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api',
  parseUserQuery, queryOpenAIEmbedding, queryPineconeDatabase, queryOpenAIChat,
  (_req, res) => {
    res.status(200).json({
      movieRecommendation: res.locals.movieRecommendation
    });
  }
);

const errorHandler = (err, _req, res, _next) => {
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