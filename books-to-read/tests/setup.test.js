import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import dotenv from 'dotenv';

describe('Environment Setup', () => {
  beforeAll(() => {
    const originalEnv = { ...process.env };
    
    process.env.PINECONE_API_KEY = 'test-api-key';
    process.env.PINECONE_ENVIRONMENT = 'test-environment';
    
    return () => {
      process.env = originalEnv;
    };
  });

  test('should set environment variables correctly', () => {
    expect(process.env.PINECONE_API_KEY).toBe('test-api-key');
    expect(process.env.PINECONE_ENVIRONMENT).toBe('test-environment');
  });
});