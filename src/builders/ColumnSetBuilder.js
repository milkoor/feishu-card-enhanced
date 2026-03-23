/**
 * ColumnSetBuilder - 列集组件构建器
 * 
 * 用于创建飞书卡片的列集组件
 * 参考官方文档：docs/components/containers/column-set.md
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-20
 */

import ContainerBuilder from './ContainerBuilder.js';

class ColumnSetBuilder extends ContainerBuilder {
  /**
   * 创建列集构建器
   */
  constructor() {
    super('column_set');

    /**
     * 布局模式
     * @type {string}
     */
    this.flexMode = 'flow';

    /**
     * 背景样式
     * @type {string}
     */
    this.backgroundStyle = 'default';

    /**
     * 列数组
     * @type {Array}
     */
    this.columns = [];
  }

  /**
   * 设置布局模式
   * @param {'flow'|'flex'} mode - 布局模式：flow（流式）或 flex（弹性）
   * @returns {ColumnSetBuilder} this
   */
  setFlexMode(mode) {
    if (!['flow', 'flex'].includes(mode)) {
      throw new Error('Flex mode must be either "flow" or "flex"');
    }
    this.flexMode = mode;
    return this;
  }

  /**
   * 设置背景样式
   * @param {'default'|'grey'|'transparent'} style - 背景样式
   * @returns {ColumnSetBuilder} this
   */
  setBackgroundStyle(style) {
    if (!['default', 'grey', 'transparent'].includes(style)) {
      throw new Error('Background style must be "default", "grey", or "transparent"');
    }
    this.backgroundStyle = style;
    return this;
  }

  /**
   * 添加列
   * @param {Object} column - 列对象（包含 tag, width, weight, vertical_align, elements 等字段）
   * @returns {ColumnSetBuilder} this
   */
  addColumn(column) {
    if (!column || column.tag !== 'column') {
      throw new Error('Column must have tag="column"');
    }
    this.columns.push(column);
    return this;
  }

  /**
   * 批量添加列
   * @param {Array} columns - 列数组
   * @returns {ColumnSetBuilder} this
   */
  addColumns(columns) {
    if (!Array.isArray(columns)) {
      throw new Error('Columns must be an array');
    }
    columns.forEach(col => this.addColumn(col));
    return this;
  }

  /**
   * 创建标准列对象
   * @param {Object} options - 列配置选项
   * @param {string} [options.width='fill'] - 列宽度（'auto', 'fill', 或百分比）
   * @param {number} [options.weight=1] - 列权重
   * @param {'top'|'middle'|'bottom'} [options.verticalAlign='top'] - 垂直对齐
   * @param {Array} [options.elements=[]] - 列内元素数组
   * @returns {Object} 列对象
   */
  static createColumn(options = {}) {
    const {
      width = 'fill',
      weight = 1,
      verticalAlign = 'top',
      elements = []
    } = options;

    return {
      tag: 'column',
      width,
      weight,
      vertical_align: verticalAlign,
      elements
    };
  }

  /**
   * 构建列集组件
   * @returns {Object} 列集组件 JSON 对象
   */
  build() {
    const result = {
      tag: this.tag,
      flex_mode: this.flexMode,
      background_style: this.backgroundStyle
    };

    // 添加容器基础属性
    if (this.elements.length > 0 || this.columns.length > 0) {
      // 如果有 columns，使用 columns；否则使用 elements
      if (this.columns.length > 0) {
        result.columns = this.columns;
      }
      if (this.elements.length > 0) {
        result.elements = this.elements;
      }
    }

    // 添加通用属性
    if (this.elementId) {
      result.element_id = this.elementId;
    }
    if (this.margin) {
      result.margin = this.margin;
    }
    if (this.direction !== 'vertical') {
      result.direction = this.direction;
    }
    if (this.horizontalSpacing !== '8px') {
      result.horizontal_spacing = this.horizontalSpacing;
    }
    if (this.verticalSpacing !== '8px') {
      result.vertical_spacing = this.verticalSpacing;
    }
    if (this.horizontalAlign !== 'left') {
      result.horizontal_align = this.horizontalAlign;
    }
    if (this.verticalAlign !== 'top') {
      result.vertical_align = this.verticalAlign;
    }
    if (this.padding !== '0px') {
      result.padding = this.padding;
    }
    if (this.behaviors.length > 0) {
      result.behaviors = this.behaviors;
    }

    return result;
  }
}

export default ColumnSetBuilder;
