import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up mock environment variables for testing
beforeAll(() => {
  // Store original env variables
  const originalEnv = { ...process.env };

  // Set up test environment variables
  process.env.PINECONE_API_KEY = 'test-api-key';
  process.env.PINECONE_ENVIRONMENT = 'test-environment';

  // Clean up function
  return () => {
    process.env = originalEnv;
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.unstubAllGlobals();
});