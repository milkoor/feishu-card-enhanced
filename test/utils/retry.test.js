import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { withRetry, isRetryableFeishuError } from '../../src/utils/retry.js';

describe('retry.js', () => {
  describe('withRetry()', () => {
    it('should succeed on first try', async () => {
      const fn = async () => 'success';
      const result = await withRetry(fn);
      assert.strictEqual(result, 'success');
    });
    
    it('should retry and eventually succeed', async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 3) throw new Error('temp error');
        return 'success';
      };
      
      const result = await withRetry(fn, { baseDelay: 10 });
      assert.strictEqual(result, 'success');
      assert.strictEqual(attempt, 3);
    });
    
    it('should throw after max retries exhausted', async () => {
      const fn = async () => { throw new Error('persistent error'); };
      
      await assert.rejects(
        withRetry(fn, { maxRetries: 2, baseDelay: 5 }),
        (err) => {
          assert.strictEqual(err.message, 'persistent error');
          return true;
        }
      );
    });
    
    it('should throw immediately for non-retryable errors', async () => {
      const fn = async () => {
        const err = new Error('non-retryable');
        err.code = 'AUTH_ERROR';
        throw err;
      };
      
      const retryableCheck = (err) => err.code !== 'AUTH_ERROR';
      
      await assert.rejects(
        withRetry(fn, { retryableErrors: retryableCheck, baseDelay: 10 }),
        (err) => {
          assert.strictEqual(err.message, 'non-retryable');
          return true;
        }
      );
    });
    
    it('should respect custom maxRetries option', async () => {
      let callCount = 0;
      const fn = async () => { callCount++; throw new Error('error'); };
      
      await assert.rejects(
        withRetry(fn, { maxRetries: 1, baseDelay: 5 }),
        (err) => err.message === 'error'
      );
      
      assert.strictEqual(callCount, 2); // 1 initial + 1 retry
    });
    
    it('should cap delay at maxDelay', async () => {
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 4) throw new Error('error');
        return 'success';
      };
      
      const result = await withRetry(fn, { maxDelay: 10, maxRetries: 3, baseDelay: 10 });
      assert.strictEqual(result, 'success');
    });
  });
  
  describe('isRetryableFeishuError()', () => {
    it('should return true for 99991663 error code', () => {
      const error = new Error('Request failed with code 99991663');
      assert.strictEqual(isRetryableFeishuError(error), true);
    });
    
    it('should return true for 99991664 error code', () => {
      const error = new Error('Request failed with code 99991664');
      assert.strictEqual(isRetryableFeishuError(error), true);
    });
    
    it('should return true for 99991400 error code', () => {
      const error = new Error('Request failed with code 99991400');
      assert.strictEqual(isRetryableFeishuError(error), true);
    });
    
    it('should return true for rate_limit error', () => {
      const error = new Error('rate_limit exceeded');
      assert.strictEqual(isRetryableFeishuError(error), true);
    });
    
    it('should return false for non-retryable error codes', () => {
      const error = new Error('Request failed with code 99999999');
      assert.strictEqual(isRetryableFeishuError(error), false);
    });
    
    it('should return false for generic errors', () => {
      const error = new Error('Something went wrong');
      assert.strictEqual(isRetryableFeishuError(error), false);
    });
    
    it('should handle multiple retryable codes in message', () => {
      const error = new Error('Error: 99991663, also saw rate_limit');
      assert.strictEqual(isRetryableFeishuError(error), true);
    });
    
    it('should return true for empty error', () => {
      assert.strictEqual(isRetryableFeishuError({}), true);
    });
  });
  
  describe('Delay calculation', () => {
    it('should use exponential backoff', async () => {
      const delays = [];
      let attempt = 0;
      const fn = async () => {
        attempt++;
        if (attempt < 3) throw new Error('error');
        return 'success';
      };
      
      const start = Date.now();
      await withRetry(fn, { maxRetries: 2, baseDelay: 20, backoffMultiplier: 2 });
      const elapsed = Date.now() - start;
      
      // Should take at least 20 + 40 = 60ms with backoff
      assert.ok(elapsed >= 60, `Expected >= 60ms, got ${elapsed}ms`);
    });
  });
});
