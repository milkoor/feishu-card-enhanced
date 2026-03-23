/**
 * ComponentRegistry - 组件注册表
 *
 * 管理所有组件构建器的注册和查找
 *
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

export class ComponentRegistry {
  /**
   * 创建组件注册表
   */
  constructor() {
    /**
     * 组件注册表
     * @type {Map<string, Function>}
     * @private
     */
    this._registry = new Map();
    // 注册内置组件
    this._registerBuiltInComponents();
  }

  /**
   * 注册内置组件
   * @private
   */
  _registerBuiltInComponents() {
    // 容器组件
    // 注意：需要在导入后注册，避免循环依赖
    // this.register('column_set', ColumnSetBuilder);
  }

  /**
   * 注册组件构建器
   * @param {string} tag - 组件标签（如 'column_set', 'button' 等）
   * @param {Function} builderClass - 构建器类
   * @returns {ComponentRegistry} this
   * @throws {Error} 当标签已存在或构建器无效时
   */
  register(tag, builderClass) {
    if (!tag || typeof tag !== 'string') {
      throw new Error('Component tag must be a non-empty string');
    }
    if (!builderClass || typeof builderClass !== 'function') {
      throw new Error('Builder must be a valid class');
    }
    if (this._registry.has(tag)) {
      console.warn(`Component "${tag}" is already registered. Overwriting...`);
    }
    this._registry.set(tag.toLowerCase(), builderClass);
    return this;
  }

  /**
   * 获取组件构建器
   * @param {string} tag - 组件标签
   * @returns {Function|undefined} 构建器类，未找到返回 undefined
   */
  get(tag) {
    if (!tag || typeof tag !== 'string') {
      return undefined;
    }
    return this._registry.get(tag.toLowerCase());
  }

  /**
   * 创建组件实例
   * @param {string} tag - 组件标签
   * @param {Object} [options] - 构建器配置选项，自动应用到 builder
   * @returns {Object} 组件构建器实例
   * @throws {Error} 当组件未注册时
   */
  create(tag, options) {
    const BuilderClass = this.get(tag);
    if (!BuilderClass) {
      throw new Error(`Component "${tag}" is not registered`);
    }
    const builder = new BuilderClass();
    // 如果有 options，自动应用配置
    if (options && typeof options === 'object') {
      for (const [key, value] of Object.entries(options)) {
        // 尝试调用对应的 setter 方法
        const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof builder[setterName] === 'function') {
          builder[setterName](value);
        } else if (key === 'user_id' && typeof builder.setUserId === 'function') {
          // 特殊处理 user_id
          builder.setUserId(value);
        }
      }
    }
    return builder;
  }

  /**
   * 检查组件是否已注册
   * @param {string} tag - 组件标签
   * @returns {boolean} 是否已注册
   */
  has(tag) {
    return this._registry.has(tag);
  }

  /**
   * 移除组件注册
   * @param {string} tag - 组件标签
   * @returns {boolean} 是否成功移除
   */
  remove(tag) {
    return this._registry.delete(tag);
  }

  /**
   * 获取所有已注册的组件标签
   * @returns {Array<string>} 组件标签数组
   */
  list() {
    return Array.from(this._registry.keys());
  }

  /**
   * 清空注册表
   * @returns {ComponentRegistry} this
   */
  clear() {
    this._registry.clear();
    return this;
  }

  /**
   * 获取已注册组件数量
   * @returns {number} 组件数量
   */
  size() {
    return this._registry.size;
  }

  /**
   * 验证组件 JSON 对象
   * @param {Object} component - 待验证的组件对象
   * @returns {{valid: boolean, errors: Array<string>}} 验证结果
   */
  static validateComponent(component) {
    const errors = [];
    if (!component || typeof component !== 'object') {
      errors.push('Component must be an object');
      return { valid: false, errors };
    }
    if (!component.tag || typeof component.tag !== 'string') {
      errors.push('Component must have a "tag" string property');
    }
    // 检查 element_id 格式（如果存在）
    if (component.element_id) {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{0,19}$/.test(component.element_id)) {
        errors.push('element_id must start with a letter, contain only letters/numbers/underscores, and be at most 20 characters');
      }
    }
    // 检查 margin 格式（如果存在）
    if (component.margin) {
      if (!/^(-?\d+px\s*)+$/.test(component.margin)) {
        errors.push('Margin must be in format like "10px", "4px 0", or "4px 12px 4px 12px"');
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

// 导出单例实例
export const registry = new ComponentRegistry();

// 注册内置组件（延迟导入避免循环依赖）
// 注意：PersonBuilder 需要在模块加载后注册
// 这里不直接导入，由使用者按需注册

export default registry;
