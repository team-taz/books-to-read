import express from 'express';

export const parseUserQuery = async (req, res, next) => {
    if (!req.body.query) {
        return next({
            log: 'Query not provided',
            status: 400,
            message: { err: 'Query is required' },
        });
    }

    if (typeof req.body.query !== 'string') {
        return next({
            log: 'Query is not a string',
            status: 400,
            message: { err: 'Query must be a string' },
        });
    }

    res.locals.userQuery = req.body.query;
    return next();
};