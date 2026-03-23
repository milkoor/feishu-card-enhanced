async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 1.5,
    retryableErrors = null
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt >= maxRetries) {
        break;
      }
      
      if (retryableErrors && !retryableErrors(error)) {
        throw error;
      }
      
      const delay = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      );
      
      console.log(`[feishu-card] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms: ${error.message}`);
      await sleep(delay);
    }
  }
  
  throw lastError;
}

function isRetryableFeishuError(error) {
  if (error.message) {
    const retryableCodes = [
      '99991663',
      '99991664', 
      '99991400',
      'rate_limit'
    ];
    return retryableCodes.some(code => error.message.includes(code));
  }
  return true;
}

export { withRetry, isRetryableFeishuError };
