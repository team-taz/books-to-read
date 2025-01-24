// import RequestHandler from 'express';

// export const logQuery: RequestHandle = asyn (_req, res, next) => {
//     const {
//         userQuery, 
//         allStructuredQueries, 
//         titleQueryResult,
//         embedding, 
//         embeddingQueryResult,
//         allBookRecommendations, 
//     } = res.locals


//     try {
//         await logs.insertOne ({
//         created: new Date(),
//         userQuery,
//         allStructuredQueries,
//         titleQueryResult, 
//         embedding,
//         embeddingQueryResult,
//         allMovieRecommendations,
//         });
//         return next();
//     } catch (err) {
//         const error = {
//             log: `log query: ${err}`,
//             status: 500,
//             message: { err: 'an error occured while logging query'},
//         };
//         return next(error)
//        }
// }

