/**
 * ID 生成器 - 生成符合飞书卡片规范的组件 ID
 * 
 * 规范：
 * - 必须以字母开头
 * - 只能包含字母、数字、下划线
 * - 长度不超过 20 个字符
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

class IDGenerator {
  /**
   * 生成随机组件 ID
   * @param {string} [prefix='comp'] - ID 前缀
   * @param {number} [maxLength=20] - 最大长度
   * @returns {string} 生成的 ID
   */
  static generate(prefix = 'comp', maxLength = 20) {
    // 清理前缀，确保符合规范
    const cleanPrefix = prefix.replace(/[^a-zA-Z]/g, '').slice(0, 10);
    const actualPrefix = cleanPrefix || 'comp';
    
    // 计算随机部分长度
    const randomLength = Math.max(1, maxLength - actualPrefix.length);
    
    // 生成随机字符串
    const randomPart = Math.random().toString(36).substring(2, 2 + randomLength);
    
    // 组合并截断到最大长度
    const id = (actualPrefix + randomPart).substring(0, maxLength);
    
    // 确保以字母开头
    if (!/^[a-zA-Z]/.test(id)) {
      return 'c' + id.substring(1);
    }
    
    return id;
  }

  /**
   * 生成唯一 ID（带时间戳）
   * @param {string} [prefix='comp'] - ID 前缀
   * @returns {string} 生成的唯一 ID
   */
  static generateUnique(prefix = 'comp') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8);
    
    // 格式：前缀 + 时间戳 + 随机数
    const raw = `${prefix}${timestamp}${randomPart}`;
    
    // 确保符合规范：以字母开头，只包含字母数字下划线，最大 20 字符
    let id = raw.replace(/[^a-zA-Z0-9_]/g, '');
    if (!/^[a-zA-Z]/.test(id)) {
      id = 'c' + id.substring(1);
    }
    
    return id.substring(0, 20);
  }

  /**
   * 批量生成 ID
   * @param {number} count - 生成数量
   * @param {string} [prefix='comp'] - ID 前缀
   * @returns {Array<string>} ID 数组
   */
  static generateBatch(count, prefix = 'comp') {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(this.generateUnique(`${prefix}${i}_`));
    }
    return ids;
  }

  /**
   * 验证 ID 是否符合规范
   * @param {string} id - 待验证的 ID
   * @returns {boolean} 是否有效
   */
  static validate(id) {
    if (!id || typeof id !== 'string') {
      return false;
    }
    
    // 检查长度
    if (id.length > 20 || id.length === 0) {
      return false;
    }
    
    // 检查格式
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(id);
  }

  /**
   * 清理 ID，移除非法字符
   * @param {string} id - 待清理的 ID
   * @returns {string} 清理后的 ID
   */
  static sanitize(id) {
    if (!id || typeof id !== 'string') {
      return 'comp';
    }
    
    // 移除非法字符
    let cleaned = id.replace(/[^a-zA-Z0-9_]/g, '');
    
    // 确保以字母开头
    if (!/^[a-zA-Z]/.test(cleaned)) {
      cleaned = 'c' + cleaned;
    }
    
    // 截断到最大长度
    return cleaned.substring(0, 20);
  }
}

export default IDGenerator;
