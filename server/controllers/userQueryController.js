import express from 'express';

export const parseUserQuery = async (req, res, next) => {
    if (!req.body.userQuery /* rename .userQuery to the correct name */) {
        const error = {
            log: 'User query not provided',
            status: 400,
            message: { err: 'An error occured while parsin the user query' },
        }
        return next(error);
    }

    const { userQuery } = req.body;

    if (typeof userQuery !== 'string') {
        const error = {
            log: 'User query is not a string',
            status: 400,
            message: { err: 'An error occured while parsin the user query' },
        }
    }

    res.locals.userQuery = userQuery;
    return next();
}