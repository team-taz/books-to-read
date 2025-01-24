import OpenAI from 'openai';
import dotenv from 'dotenv';
import process from 'process';

// Configure dotenv at top of file

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const queryOpenAIEmbedding = async (req, res, next) => {
  const { userQuery } = res.locals;

  // console.log('queryOpenAIEmbedding is logging: res.locals equal to');
  // console.log(res.locals);

  // console.log('AND THIS IS userQuery');
  // console.log(userQuery);

  if (!userQuery) {
    const error = {
      log: 'queryOpenAIEmbedding did not receive a user query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  try {
    //variable holds the response from OpenAI's createEmbedding API call
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userQuery,
      encoding_format: 'float',
    });

    //The embedding property inside data[0] contains the actual embedding
    // console.log(embeddingResponse);
    res.locals.embedding = embeddingResponse.data[0].embedding; //console.log: { data: [ { embedding: [Array] } ] }
    // console.log(res.locals.embedding);
    return next();
  } catch (error) {
    const err = {
      log: 'queryOpenAI: Error: OpenAI error',
      message: { err: 'An error occurred while querying OpenAI' },
      status: 500,
    };
    return next(error);
  }
};

export const queryOpenAIChat = async (req, res, next) => {
  const { userQuery, pineconeQueryResult } = res.locals;

  console.log('queryOpenAIChat: ');
  console.log(userQuery);
  console.log(pineconeQueryResult);

  if (!userQuery) {
    const error = {
      log: 'queryOpenAIChat did not receive a user query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }
  if (!pineconeQueryResult) {
    const error = {
      log: 'queryOpenAIChat did not receive pinecone query results',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  //handle chat completions with GPT
  try {
    const contextMessages = pineconeQueryResult.map(
      (result) =>
        `${result.metadata.title} (${result.metadata.year}): ${result.metadata.plot}`
    );
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful book recommendation assistant. Use the provided book context to answer questions and make recommendations.',
        },
        {
          role: 'user',
          content: `Context about relevant books:\n${contextMessages.join(
            '\n\n'
          )}\n\nUser question: ${userQuery}`,
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      const error = {
        log: 'OpenAI did not return a completion',
        message: { err: 'An error occurred while querying OpenAI' },
        status: 500,
      };
      return next(error);
    }
    res.locals.bookRecommendation = content;
    return next();
  } catch (err) {
    const error = {
      //log: `queryOpenAI: Error: ${err instanceof Error ? err.message : 'OpenAI error'}`,
      log: 'queryOpenAI: Error: OpenAI error',
      message: { err: 'An error occurred while querying OpenAI' },
      status: 500,
    };
    return next(error);
  }
};
