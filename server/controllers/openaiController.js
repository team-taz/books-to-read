import OpenAI from 'openai';
import dotenv from 'dotenv';
import process from 'process'

// Configure dotenv at top of file

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY|| ''
});

export const queryOpenAIEmbedding = async (_req, res, next) => {
    const { userQuery }= res.locals;
    if (!userQuery) {
      const error = {
        log: 'queryOpenAIEmbedding did not receive a user query',
        status: 500,
        message: { err: 'An error occurred before querying OpenAI' },
      };
      return next(error);
    }

    try { //variable holds the response from OpenAI's createEmbedding API call
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: userQuery,
          encoding_format: 'float'
        });


        //The embedding property inside data[0] contains the actual embedding
        // console.log(embeddingResponse);
        res.locals.embedding = embeddingResponse.data[0].embedding; //console.log: { data: [ { embedding: [Array] } ] }
        return next();
    } catch (error){
      const err = {
        log: "queryOpenAI: Error: OpenAI error",
        message: { "err": "An error occurred while querying OpenAI"},
        status: 500,
      };
      return next(error);
    }
};

export const queryOpenAIChat = async (_req, res, next) => {
    const { userQuery, pineconeQueryResult } = res.locals;
     // Debug logs for input validation
     console.log('\n=== OpenAI Chat Input Validation ===');
     console.log('User Query:', userQuery);
     console.log('Pinecone Results Received:', {
       resultCount: pineconeQueryResult?.length || 0,
       firstMatch: pineconeQueryResult?.[0] ? {
         bookId: pineconeQueryResult[0].metadata.book_id,
         rating: pineconeQueryResult[0].metadata.rating,
         score: pineconeQueryResult[0].score,
         metadata: pineconeQueryResult[0].metadata
       } : 'No matches'
     });
    
     if (!userQuery || !pineconeQueryResult) {
      const error = {
        log: `Missing required data: ${!userQuery ? 'userQuery' : 'pineconeQueryResult'}`,
        status: 500,
        message: { err: 'An error occurred before querying OpenAI' },
      };
      return next(error);
    }
  
  //handle chat completions with GPT
  try {
    // Step 1: Create context messages
    let contextMessages;
    try {
      contextMessages = pineconeQueryResult.map(result => {
        if (!result.metadata || !result.metadata.book_id) {
          throw new Error(`Invalid result metadata: ${JSON.stringify(result)}`);
        }
        return `Book ID: ${result.metadata.book_id} | Rating: ${result.metadata.rating || 'N/A'} | Match Score: ${(result.score * 100).toFixed(1)}%`;
      });
      console.log('\n=== Constructed Context ===');
        console.log('Number of matches:', contextMessages.length);
        console.log('Context messages:', contextMessages);
      } catch (err) {
        throw new Error(`Failed to create context messages: ${err.message}`);
      }
      // Step 2: Construct messages array
      let messages;
      try {
        messages = [
          {
            role: "system",
            content: "You are a helpful book recommendation assistant. Based on the matched similar books (identified by their IDs and ratings), provide thoughtful recommendations."
          },
          {
            role: "user",
            content: `Similar books found in our database:\n${contextMessages.join('\n')}\n\nUser query: ${userQuery}\n\nPlease provide book recommendations based on these similar matches and the user's query.`
          }
        ];

        console.log('\n=== Final Prompt to OpenAI ===');
        console.log('Messages structure:', JSON.stringify(messages, null, 2));
      } catch (err) {
        throw new Error(`Failed to construct messages: ${err.message}`);
      }

      // Step 3: Make OpenAI API call
      let response;
      try {
        console.log('\n=== Making OpenAI API Call ===');
        response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        });
        
        console.log('OpenAI API call successful');
        console.log('Response structure:', JSON.stringify(response.choices[0], null, 2));
      } catch (err) {
        throw new Error(`OpenAI API call failed: ${err.message}`);
      }

      // Step 4: Process response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('OpenAI returned empty content');
      }

      console.log('\n=== Final Response ===');
      console.log('Content preview:', content.substring(0, 200));

      res.locals.bookRecommendation = content;
      return next();

    } catch (err) {
      console.error('\n=== Error Details ===');
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      const error = {
        log: `queryOpenAI detailed error: ${err.message}`,
        message: { err: "An error occurred while querying OpenAI" },
        status: 500,
      };
      return next(error);
    }
};