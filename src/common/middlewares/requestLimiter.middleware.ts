import {Request, Response, NextFunction} from "express";

export const requestLimiterMiddleware = (maxConcurrentRequests: number) => {
    let requestCount = 0;

    return async (req: Request, res: Response, next: NextFunction) => {
        if (requestCount >= maxConcurrentRequests) {
            res.status(429).json({ error: 'Too Many Requests' });
        } else {
            requestCount += 1;
            next();
        }

        res.on('finish', () => {
            requestCount -= 1;
        });
    };
};
