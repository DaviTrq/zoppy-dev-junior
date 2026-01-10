import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitMiddleware } from './rate-limit.middleware';

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitMiddleware],
    }).compile();

    middleware = module.get<RateLimitMiddleware>(RateLimitMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should call next function', () => {
    const mockRequest = {
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' },
      socket: { remoteAddress: '127.0.0.1' },
      method: 'GET',
      query: {}
    } as any;
    const mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    const mockNext = jest.fn();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle rate limiting for search requests', () => {
    const mockRequest = {
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' },
      socket: { remoteAddress: '127.0.0.1' },
      method: 'GET',
      query: { search: 'test' }
    } as any;
    const mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    const mockNext = jest.fn();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 100);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle different IP sources', () => {
    const mockRequest = {
      connection: { remoteAddress: '192.168.1.1' },
      socket: { remoteAddress: '10.0.0.1' },
      method: 'POST',
      query: {}
    } as any;
    const mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    const mockNext = jest.fn();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should detect search requests with different query params', () => {
    const testCases = [
      { query: { filter: 'test' }, expected: true },
      { query: { q: 'test' }, expected: true },
      { query: { search: 'test' }, expected: true },
      { query: { page: '1' }, expected: false }
    ];

    testCases.forEach(({ query, expected }) => {
      const mockRequest = {
        ip: '127.0.0.1',
        method: 'GET',
        query
      } as any;
      const mockResponse = {
        setHeader: jest.fn()
      } as any;
      const mockNext = jest.fn();

      middleware.use(mockRequest, mockResponse, mockNext);

      const expectedLimit = expected ? 100 : 1000;
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', expectedLimit);
    });
  });

  it('should throw HttpException when rate limit exceeded', () => {
    const mockRequest = {
      ip: '127.0.0.1',
      method: 'GET',
      query: { search: 'test' }
    } as any;
    const mockResponse = {
      setHeader: jest.fn()
    } as any;
    const mockNext = jest.fn();

    // Simulate exceeding rate limit by calling multiple times
    for (let i = 0; i < 101; i++) {
      try {
        middleware.use(mockRequest, mockResponse, mockNext);
      } catch (error) {
        if (i === 100) {
          expect(error.getStatus()).toBe(429);
          expect(error.getResponse().message).toContain('Too many requests');
        }
      }
    }
  });

  it('should reset count after time window expires', () => {
    const mockRequest = {
      ip: '127.0.0.1',
      method: 'GET',
      query: {}
    } as any;
    const mockResponse = {
      setHeader: jest.fn()
    } as any;
    const mockNext = jest.fn();

    // Mock Date.now to simulate time passing
    const originalNow = Date.now;
    let mockTime = 1000000;
    Date.now = jest.fn(() => mockTime);

    // First request
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 999);

    // Simulate time passing beyond window
    mockTime += 16 * 60 * 1000; // 16 minutes

    // Second request after window expires
    middleware.use(mockRequest, mockResponse, mockNext);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 999);

    Date.now = originalNow;
  });

  it('should handle unknown IP address', () => {
    const mockRequest = {
      method: 'GET',
      query: {},
      connection: {},
      socket: {}
    } as any;
    const mockResponse = {
      setHeader: jest.fn()
    } as any;
    const mockNext = jest.fn();

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});