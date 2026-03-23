/**
 * ComponentBuilder - 飞书卡片组件构建器基类
 *
 * 提供所有组件共用的基础字段和方法
 * 参考官方文档：docs/official/component-overview-20260320.md
 *
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

/**
 * 自定义错误类
 */
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 组件构建器基类
 */
export class ComponentBuilder {
  /**
   * 创建组件构建器
   * @param {string} tag - 组件标签（如 'column_set', 'button' 等）
   */
  constructor(tag) {
    if (!tag || typeof tag !== 'string') {
      throw new ValidationError('Component tag is required and must be a string');
    }
    /**
     * 组件标签
     * @type {string}
     */
    this.tag = tag;
    /**
     * 组件唯一标识符（可选）
     * @type {string|null}
     */
    this.elementId = null;
    /**
     * 组件外边距（可选）
     * @type {string|null}
     */
    this.margin = null;
    /**
     * 组件行为配置（可选）
     * @type {Array}
     */
    this.behaviors = [];
  }

  /**
   * 设置组件唯一标识符
   * @param {string} elementId - 组件 ID（必须以字母开头，只包含字母、数字、下划线，不超过 20 字符）
   * @returns {ComponentBuilder} this
   * @throws {ValidationError} 当 elementId 格式不正确时
   */
  setElementId(elementId) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,19}$/.test(elementId)) {
      throw new ValidationError(
        'elementId must start with a letter, contain only letters/numbers/underscores, and be at most 20 characters'
      );
    }
    this.elementId = elementId;
    return this;
  }

  /**
   * 设置组件外边距
   * @param {string} margin - 外边距值（如 '10px', '4px 0', '4px 12px 4px 12px'）
   * @returns {ComponentBuilder} this
   * @throws {ValidationError} 当 margin 格式不正确时
   */
  setMargin(margin) {
    if (!/^(\d+px\s*)+$/.test(margin)) {
      throw new ValidationError('Margin must be in format like "10px", "4px 0", or "4px 12px 4px 12px"');
    }
    this.margin = margin;
    return this;
  }

  /**
   * 添加行为配置
   * @param {Object} behavior - 行为配置对象
   * @param {string} behavior.type - 行为类型（'callback' 或 'open_url'）
   * @param {Object} [behavior.value] - 回调数据（当 type 为 'callback' 时）
   * @param {string} [behavior.default_url] - 默认跳转链接（当 type 为 'open_url' 时）
   * @param {string} [behavior.android_url] - Android 跳转链接
   * @param {string} [behavior.ios_url] - iOS 跳转链接
   * @param {string} [behavior.pc_url] - PC 跳转链接
   * @returns {ComponentBuilder} this
   */
  addBehavior(behavior) {
    if (!behavior || !behavior.type) {
      throw new ValidationError('Behavior must have a type');
    }
    if (!['callback', 'open_url'].includes(behavior.type)) {
      throw new ValidationError('Behavior type must be either "callback" or "open_url"');
    }
    this.behaviors.push(behavior);
    return this;
  }

  /**
   * 添加回调行为
   * @param {Object|string} value - 回调数据
   * @returns {ComponentBuilder} this
   */
  addCallbackBehavior(value) {
    return this.addBehavior({ type: 'callback', value: value });
  }

  /**
   * 添加打开链接行为
   * @param {string} url - 链接地址
   * @returns {ComponentBuilder} this
   */
  addOpenUrlBehavior(url) {
    return this.addBehavior({ type: 'open_url', default_url: url, android_url: url, ios_url: url, pc_url: url });
  }

  /**
   * 构建基础组件对象
   * @returns {Object} 基础组件 JSON 对象
   */
  _buildBase() {
    const base = { tag: this.tag };
    if (this.elementId) {
      base.element_id = this.elementId;
    }
    if (this.margin) {
      base.margin = this.margin;
    }
    if (this.behaviors.length > 0) {
      base.behaviors = this.behaviors;
    }
    return base;
  }

  /**
   * 构建组件对象（由子类实现）
   * @returns {Object} 组件 JSON 对象
   * @throws {Error} 当子类未实现 build 方法时
   */
  build() {
    throw new Error('build() method must be implemented by subclass');
  }

  /**
   * 验证组件 ID 格式
   * @param {string} id - 待验证的 ID
   * @returns {boolean} 是否有效
   */
  static validateElementId(id) {
    return /^[a-zA-Z][a-zA-Z0-9_]{0,19}$/.test(id);
  }

  /**
   * 验证边距格式
   * @param {string} margin - 待验证的边距
   * @returns {boolean} 是否有效
   */
  static validateMargin(margin) {
    return /^(\d+px\s*)+$/.test(margin);
  }

  /**
   * 校验必填字段
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {string} [displayName] - 显示名称
   */
  validateRequired(field, value, displayName) {
    const name = displayName || field;
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${name} 是必填字段`);
    }
  }

  /**
   * 校验枚举值
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {Array} allowedValues - 允许的值列表
   * @param {string} [displayName] - 显示名称
   */
  validateEnum(field, value, allowedValues, displayName) {
    if (value === undefined || value === null) {
      return true;
    }
    const name = displayName || field;
    if (!allowedValues.includes(value)) {
      throw new ValidationError(`${name} 必须是 [${allowedValues.join(', ')}] 之一，当前值：${value}`);
    }
  }

  /**
   * 校验布尔值
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {string} [displayName] - 显示名称
   */
  validateBoolean(field, value, displayName) {
    if (value === undefined || value === null) {
      return true;
    }
    const name = displayName || field;
    if (typeof value !== 'boolean') {
      throw new ValidationError(`${name} 必须是布尔值，当前值：${value}`);
    }
  }

  /**
   * 校验字符串
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {string} [displayName] - 显示名称
   */
  validateString(field, value, displayName) {
    if (value === undefined || value === null) {
      return true;
    }
    const name = displayName || field;
    if (typeof value !== 'string') {
      throw new ValidationError(`${name} 必须是字符串，当前值：${value}`);
    }
  }

  /**
   * 校验 URL 格式
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {string} [displayName] - 显示名称
   */
  validateUrl(field, value, displayName) {
    if (value === undefined || value === null || value === '') {
      return true;
    }
    const name = displayName || field;
    try {
      new URL(value);
      return true;
    } catch {
      throw new ValidationError(`${name} 必须是有效的 URL 格式，当前值：${value}`);
    }
  }

  /**
   * 校验数组
   * @param {string} field - 字段名
   * @param {*} value - 字段值
   * @param {string} [displayName] - 显示名称
   */
  validateArray(field, value, displayName) {
    if (value === undefined || value === null) {
      return true;
    }
    const name = displayName || field;
    if (!Array.isArray(value)) {
      throw new ValidationError(`${name} 必须是数组，当前值：${value}`);
    }
  }
}

export default ComponentBuilder;
