/**
 * 错误处理器 - 统一处理飞书卡片相关错误
 * 
 * 提供错误分类、格式化、日志记录功能
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

/**
 * 错误类型枚举
 */
const ErrorType = {
  VALIDATION: 'VALIDATION_ERROR',
  COMPONENT: 'COMPONENT_ERROR',
  API: 'API_ERROR',
  NETWORK: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * 错误处理器类
 */
class ErrorHandler {
  /**
   * 创建错误实例
   * @param {string} message - 错误信息
   * @param {string} [type=ErrorType.UNKNOWN] - 错误类型
   * @param {Error} [originalError] - 原始错误对象
   */
  constructor(message, type = ErrorType.UNKNOWN, originalError = null) {
    this.message = message;
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.stack = originalError ? originalError.stack : new Error().stack;
  }

  /**
   * 转换为对象
   * @returns {Object} 错误对象
   */
  toObject() {
    return {
      message: this.message,
      type: this.type,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }

  /**
   * 转换为 JSON 字符串
   * @returns {string} JSON 字符串
   */
  toJSON() {
    return JSON.stringify(this.toObject(), null, 2);
  }

  /**
   * 创建验证错误
   * @param {string} message - 错误信息
   * @param {Error} [originalError] - 原始错误
   * @returns {ErrorHandler} 错误实例
   */
  static validationError(message, originalError) {
    return new this(message, ErrorType.VALIDATION, originalError);
  }

  /**
   * 创建组件错误
   * @param {string} message - 错误信息
   * @param {Error} [originalError] - 原始错误
   * @returns {ErrorHandler} 错误实例
   */
  static componentError(message, originalError) {
    return new this(message, ErrorType.COMPONENT, originalError);
  }

  /**
   * 创建 API 错误
   * @param {string} message - 错误信息
   * @param {Error} [originalError] - 原始错误
   * @returns {ErrorHandler} 错误实例
   */
  static apiError(message, originalError) {
    return new this(message, ErrorType.API, originalError);
  }

  /**
   * 创建网络错误
   * @param {string} message - 错误信息
   * @param {Error} [originalError] - 原始错误
   * @returns {ErrorHandler} 错误实例
   */
  static networkError(message, originalError) {
    return new this(message, ErrorType.NETWORK, originalError);
  }

  /**
   * 创建未知错误
   * @param {string} message - 错误信息
   * @param {Error} [originalError] - 原始错误
   * @returns {ErrorHandler} 错误实例
   */
  static unknownError(message, originalError) {
    return new this(message, ErrorType.UNKNOWN, originalError);
  }

  /**
   * 记录错误日志
   * @param {boolean} [verbose=false] - 是否输出详细信息
   */
  log(verbose = false) {
    const logData = {
      level: 'ERROR',
      type: this.type,
      message: this.message,
      timestamp: this.timestamp
    };

    console.error('[ErrorHandler]', JSON.stringify(logData, null, 2));

    if (verbose && this.originalError) {
      console.error('Original Error:', this.originalError);
    }

    if (verbose && this.stack) {
      console.error('Stack:', this.stack);
    }
  }

  /**
   * 抛出错误
   * @throws {Error} 错误对象
   */
  throw() {
    const error = new Error(this.message);
    error.type = this.type;
    error.timestamp = this.timestamp;
    if (this.originalError) {
      error.originalError = this.originalError;
    }
    throw error;
  }
}

/**
 * 安全执行函数，捕获并处理异常
 * @param {Function} fn - 要执行的函数
 * @param {string} [context='Unknown'] - 执行上下文
 * @returns {Promise<{success: boolean, error?: ErrorHandler, result?: any}>} 执行结果
 */
async function safeExecute(fn, context = 'Unknown') {
  try {
    const result = await fn();
    return { success: true, result };
  } catch (error) {
    const handler = new ErrorHandler(
      `Error in ${context}: ${error.message}`,
      ErrorType.UNKNOWN,
      error
    );
    return { success: false, error: handler };
  }
}

/**
 * 包装函数，添加错误处理
 * @param {Function} fn - 要包装的函数
 * @param {string} [name='Anonymous'] - 函数名称
 * @returns {Function} 包装后的函数
 */
function wrapFunction(fn, name = 'Anonymous') {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handler = new ErrorHandler(
        `Error in ${name}: ${error.message}`,
        ErrorType.UNKNOWN,
        error
      );
      handler.log();
      throw handler;
    }
  };
}

export {
  ErrorHandler,
  ErrorType,
  safeExecute,
  wrapFunction
};
