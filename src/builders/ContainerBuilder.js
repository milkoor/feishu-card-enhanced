/**
 * ContainerBuilder - 飞书卡片容器组件构建器基类
 * 
 * 继承自 ComponentBuilder，提供容器组件共有的字段和方法
 * 参考官方文档：
 * - docs/official/component-overview-20260320.md
 * - docs/components/containers/column-set.md
 * - docs/components/containers/form-container.md
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

import ComponentBuilder from './ComponentBuilder.js';

class ContainerBuilder extends ComponentBuilder {
  /**
   * 创建容器构建器
   * @param {string} tag - 容器标签（如 'column_set', 'form' 等）
   */
  constructor(tag) {
    super(tag);

    /**
     * 容器内组件排列方向
     * @type {string}
     */
    this.direction = 'vertical';

    /**
     * 水平间距
     * @type {string}
     */
    this.horizontalSpacing = '8px';

    /**
     * 垂直间距
     * @type {string}
     */
    this.verticalSpacing = '8px';

    /**
     * 水平对齐方式
     * @type {string}
     */
    this.horizontalAlign = 'left';

    /**
     * 垂直对齐方式
     * @type {string}
     */
    this.verticalAlign = 'top';

    /**
     * 内边距
     * @type {string}
     */
    this.padding = '0px';

    /**
     * 子元素数组
     * @type {Array}
     */
    this.elements = [];
  }

  /**
   * 设置容器排列方向
   * @param {'vertical'|'horizontal'} direction - 排列方向
   * @returns {ContainerBuilder} this
   */
  setDirection(direction) {
    if (!['vertical', 'horizontal'].includes(direction)) {
      throw new Error('Direction must be either "vertical" or "horizontal"');
    }
    this.direction = direction;
    return this;
  }

  /**
   * 设置水平间距
   * @param {string} spacing - 间距值（如 'small', 'medium', 'large', '8px' 等）
   * @returns {ContainerBuilder} this
   */
  setHorizontalSpacing(spacing) {
    this.horizontalSpacing = this._validateSpacing(spacing);
    return this;
  }

  /**
   * 设置垂直间距
   * @param {string} spacing - 间距值
   * @returns {ContainerBuilder} this
   */
  setVerticalSpacing(spacing) {
    this.verticalSpacing = this._validateSpacing(spacing);
    return this;
  }

  /**
   * 设置水平对齐方式
   * @param {'left'|'center'|'right'} align - 对齐方式
   * @returns {ContainerBuilder} this
   */
  setHorizontalAlign(align) {
    if (!['left', 'center', 'right'].includes(align)) {
      throw new Error('Horizontal align must be "left", "center", or "right"');
    }
    this.horizontalAlign = align;
    return this;
  }

  /**
   * 设置垂直对齐方式
   * @param {'top'|'center'|'bottom'} align - 对齐方式
   * @returns {ContainerBuilder} this
   */
  setVerticalAlign(align) {
    if (!['top', 'center', 'bottom'].includes(align)) {
      throw new Error('Vertical align must be "top", "center", or "bottom"');
    }
    this.verticalAlign = align;
    return this;
  }

  /**
   * 设置内边距
   * @param {string} padding - 内边距值
   * @returns {ContainerBuilder} this
   */
  setPadding(padding) {
    if (!/^(-?\d+px\s*)+$/.test(padding)) {
      throw new Error('Padding must be in format like "10px", "4px 0", or "4px 12px 4px 12px"');
    }
    this.padding = padding;
    return this;
  }

  /**
   * 添加子元素
   * @param {Object|ComponentBuilder} element - 子元素对象或构建器
   * @returns {ContainerBuilder} this
   */
  addElement(element) {
    if (element && typeof element.build === 'function') {
      // 如果是构建器，调用 build 方法
      this.elements.push(element.build());
    } else {
      // 否则直接添加
      this.elements.push(element);
    }
    return this;
  }

  /**
   * 批量添加子元素
   * @param {Array} elements - 子元素数组
   * @returns {ContainerBuilder} this
   */
  addElements(elements) {
    if (!Array.isArray(elements)) {
      throw new Error('Elements must be an array');
    }
    elements.forEach(el => this.addElement(el));
    return this;
  }

  /**
   * 验证间距值
   * @param {string} spacing - 间距值
   * @returns {string} 验证后的间距值
   * @private
   */
  _validateSpacing(spacing) {
    const validEnums = ['small', 'medium', 'large', 'extra_large'];
    if (validEnums.includes(spacing) || /^(\d+px\s*)+$/.test(spacing)) {
      return spacing;
    }
    throw new Error('Invalid spacing value');
  }

  /**
   * 构建基础容器对象
   * @returns {Object} 容器组件 JSON 对象
   * @protected
   */
  _buildContainerBase() {
    const base = this._buildBase();

    base.direction = this.direction;
    base.horizontal_spacing = this.horizontalSpacing;
    base.vertical_spacing = this.verticalSpacing;
    base.horizontal_align = this.horizontalAlign;
    base.vertical_align = this.verticalAlign;
    base.padding = this.padding;

    if (this.elements.length > 0) {
      base.elements = this.elements;
    }

    return base;
  }

  /**
   * 构建容器对象（由子类实现）
   * @returns {Object} 容器组件 JSON 对象
   * @throws {Error} 当子类未实现 build 方法时
   */
  build() {
    throw new Error('build() method must be implemented by subclass');
  }
}

export default ContainerBuilder;
