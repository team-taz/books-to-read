import express from 'express';

export const parseUserQuery = async (req, res, next) => {
  console.log('userQueryController MESSAGE: req.body is equal to:');
  console.log(req.body);

  if (!req.body.userQuery /* rename .userQuery to the correct name */) {
    // console.log('ERRORRRRRR');
    const error = {
      log: 'User query not provided',
      status: 400,
      message: { err: 'An error occured while parsin the user query' },
    };
    return next(error);
  }
  //   console.log(req.body);
  const { userQuery } = req.body;
  //   console.log(userQuery);

  if (typeof userQuery !== 'string') {
    const error = {
      log: 'User query is not a string',
      status: 400,
      message: { err: 'An error occured while parsin the user query' },
    };
  }
  //   console.log('WORKS');
  res.locals.userQuery = userQuery;
  return next();
};
