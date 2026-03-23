/**
 * 辅助工具函数集合
 * 
 * 提供常用的工具函数
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

/**
 * 深度合并两个对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }
  
  return result;
}

/**
 * 判断是否是对象
 * @param {*} value - 待判断的值
 * @returns {boolean} 是否是对象
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 判断是否是空对象
 * @param {*} value - 待判断的值
 * @returns {boolean} 是否是空对象
 */
function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  
  return false;
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * 格式化 JSON 对象（用于输出）
 * @param {Object} obj - 要格式化的对象
 * @param {number} [indent=2] - 缩进空格数
 * @returns {string} 格式化后的 JSON 字符串
 */
function formatJSON(obj, indent = 2) {
  return JSON.stringify(obj, null, indent);
}

/**
 * 解析 JSON 字符串，失败时返回默认值
 * @param {string} jsonString - JSON 字符串
 * @param {*} [defaultValue] - 解析失败时的默认值
 * @returns {*} 解析结果或默认值
 */
function safeJSONParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 生成随机字符串
 * @param {number} length - 长度
 * @returns {string} 随机字符串
 */
function randomString(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 限流函数
 * @param {Function} fn - 要执行的函数
 * @param {number} limit - 时间窗口（毫秒）
 * @returns {Function} 限流后的函数
 */
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 等待指定毫秒数
 * @param {number} ms - 毫秒数
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试执行函数
 * @param {Function} fn - 要执行的函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} [delay=1000] - 重试间隔（毫秒）
 * @returns {Promise<any>} 执行结果
 */
async function retry(fn, maxRetries, delay = 1000) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
}

export {
  deepMerge,
  isObject,
  isEmpty,
  deepClone,
  formatJSON,
  safeJSONParse,
  randomString,
  debounce,
  throttle,
  sleep,
  retry
};
