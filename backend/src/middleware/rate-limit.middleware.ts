import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs = 15 * 60 * 1000; // 15 minutos
  private readonly maxRequests = 1000; // máximo de requests por janela
  private readonly maxSearchRequests = 100; // máximo de buscas por janela

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = this.getClientIp(req);
    const isSearchRequest = this.isSearchRequest(req);
    const limit = isSearchRequest ? this.maxSearchRequests : this.maxRequests;
    
    const key = `${clientIp}:${isSearchRequest ? 'search' : 'general'}`;
    const now = Date.now();
    
    // Limpa registros expirados
    this.cleanExpiredEntries(now);
    
    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
    } else if (now > this.store[key].resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
    } else {
      this.store[key].count++;
    }

    const current = this.store[key];
    
    // Adiciona headers de rate limit
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current.count));
    res.setHeader('X-RateLimit-Reset', new Date(current.resetTime).toISOString());

    if (current.count > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Limit: ${limit} requests per ${this.windowMs / 1000 / 60} minutes`,
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    next();
  }

  private getClientIp(req: Request): string {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           'unknown';
  }

  private isSearchRequest(req: Request): boolean {
    return req.method === 'GET' && 
           (req.query.search || req.query.filter || req.query.q);
  }

  private cleanExpiredEntries(now: number) {
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}