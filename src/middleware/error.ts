import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Log error (bisa kirim ke winston, sentry, dll)
  console.error(`[${req.method}] ${req.url} - ${status} - ${err.message}`);

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // traceId atau requestId bisa ditambahkan untuk debugging
  });
};
