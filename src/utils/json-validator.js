/**
 * JSON Schema 验证器 - 验证飞书卡片组件 JSON 结构
 * 
 * 提供组件级别的验证功能
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

class JSONValidator {
  /**
   * 验证组件对象
   * @param {Object} component - 待验证的组件对象
   * @returns {{valid: boolean, errors: Array<string>, warnings: Array<string>}} 验证结果
   */
  static validateComponent(component) {
    const errors = [];
    const warnings = [];

    // 基础检查
    if (!component || typeof component !== 'object') {
      errors.push('Component must be an object');
      return { valid: false, errors, warnings };
    }

    // 检查 tag 字段
    if (!component.tag) {
      errors.push('Component must have a "tag" property');
    } else if (typeof component.tag !== 'string') {
      errors.push('Component tag must be a string');
    }

    // 检查 element_id（如果存在）
    if (component.element_id) {
      if (!this.validateElementId(component.element_id)) {
        errors.push('Invalid element_id format');
      }
    }

    // 检查 margin（如果存在）
    if (component.margin) {
      if (!this.validateMargin(component.margin)) {
        errors.push('Invalid margin format');
      }
    }

    // 检查 behaviors（如果存在）
    if (component.behaviors) {
      if (!Array.isArray(component.behaviors)) {
        errors.push('Behaviors must be an array');
      } else {
        component.behaviors.forEach((behavior, index) => {
          if (!behavior.type) {
            errors.push(`Behavior[${index}] must have a type`);
          } else if (!['callback', 'open_url'].includes(behavior.type)) {
            errors.push(`Behavior[${index}] type must be "callback" or "open_url"`);
          }
        });
      }
    }

    // 检查 elements（如果存在）
    if (component.elements) {
      if (!Array.isArray(component.elements)) {
        errors.push('Elements must be an array');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证 element_id
   * @param {string} id - 待验证的 ID
   * @returns {boolean} 是否有效
   */
  static validateElementId(id) {
    if (!id || typeof id !== 'string') {
      return false;
    }
    return /^[a-zA-Z][a-zA-Z0-9_]{0,19}$/.test(id);
  }

  /**
   * 验证 margin
   * @param {string} margin - 待验证的边距
   * @returns {boolean} 是否有效
   */
  static validateMargin(margin) {
    if (!margin || typeof margin !== 'string') {
      return false;
    }
    return /^(\d+px\s*)+$/.test(margin);
  }

  /**
   * 验证卡片整体结构
   * @param {Object} card - 卡片对象
   * @returns {{valid: boolean, errors: Array<string>, warnings: Array<string>}} 验证结果
   */
  static validateCard(card) {
    const errors = [];
    const warnings = [];

    if (!card || typeof card !== 'object') {
      errors.push('Card must be an object');
      return { valid: false, errors, warnings };
    }

    // 检查 schema 版本
    if (!card.schema) {
      warnings.push('Card schema version not specified');
    } else if (card.schema !== '2.0') {
      warnings.push(`Unsupported schema version: ${card.schema}`);
    }

    // 检查 body
    if (!card.body) {
      errors.push('Card must have a body');
    } else {
      // 检查 body 中的 elements
      if (card.body.elements && !Array.isArray(card.body.elements)) {
        errors.push('Body elements must be an array');
      }
    }

    // 检查 config
    if (card.config) {
      if (card.config.auto_height !== undefined) {
        if (typeof card.config.auto_height !== 'boolean') {
          errors.push('Config auto_height must be a boolean');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 深度验证组件树
   * @param {Object} component - 组件对象
   * @param {string} [path=''] - 当前路径（用于错误定位）
   * @returns {{valid: boolean, errors: Array<string>, warnings: Array<string>, count: number}} 验证结果
   */
  static validateDeep(component, path = '') {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
      count: 0
    };

    // 验证当前组件
    const componentResult = this.validateComponent(component);
    result.errors.push(...componentResult.errors.map(e => `${path ? path + ': ' : ''}${e}`));
    result.warnings.push(...componentResult.warnings.map(w => `${path ? path + ': ' : ''}${w}`));
    result.count++;

    // 递归验证子组件
    if (component.elements && Array.isArray(component.elements)) {
      component.elements.forEach((child, index) => {
        const childPath = `${path}.elements[${index}]`;
        const childResult = this.validateDeep(child, childPath);
        result.errors.push(...childResult.errors);
        result.warnings.push(...childResult.warnings);
        result.count += childResult.count;
        result.valid = result.valid && childResult.valid;
      });
    }

    result.valid = result.valid && componentResult.valid;
    return result;
  }
}

export default JSONValidator;
