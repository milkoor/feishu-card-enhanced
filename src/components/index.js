/**
 * 飞书卡片组件库 - 完整版
 * 支持所有官方组件，可按需扩展
 */

import { buildStepList } from './step-list.js';
import { buildLogFold } from './log-fold.js';
import { buildFileList } from './file-list.js';

// ========== 展示类组件 ==========

/**
 * 标题组件
 * @param {string} content - 标题内容
 * @param {string} template - 颜色模板 (blue, green, red, yellow, orange, purple, grey)
 */
function buildTitle(content, template = 'blue') {
  return {
    tag: 'header',
    title: {
      tag: 'plain_text',
      content
    },
    template: template
  };
}

/**
 * 普通文本组件
 * @param {string} content - 文本内容
 * @param {string} size - 字体大小 (normal, large)
 * @param {string} align - 对齐方式 (left, center, right)
 * @param {string} color - 颜色 (default, red, grey)
 */
function buildDiv(content, { size = 'normal', align = 'left', color = 'default' } = {}) {
  return {
    tag: 'div',
    text: {
      tag: 'lark_md',
      content
    },
    size,
    align,
    color
  };
}

/**
 * 富文本组件 (Markdown)
 * @param {string} content - Markdown 内容
 */
function buildMarkdown(content) {
  return {
    tag: 'markdown',
    content
  };
}

/**
 * 图片组件
 * @param {string} imgKey - 图片 key (从上传接口获得)
 * @param {string} alt - 图片描述
 */
function buildImage(imgKey, alt = '图片') {
  return {
    tag: 'img',
    img_key: imgKey,
    alt: {
      tag: 'plain_text',
      content: alt
    }
  };
}

/**
 * 多图混排组件
 * @param {string[]} imgKeys - 图片 key 数组
 */
function buildImageCombination(imgKeys) {
  return {
    tag: 'img_combination',
    img_keys: imgKeys
  };
}

/**
 * 分割线组件
 */
function buildDivider() {
  return { tag: 'hr' };
}

/**
 * 进度条组件
 * @param {number} value - 进度值 (0-100)
 * @param {string} label - 进度标签
 */
function buildProgress(value, label = '整体进度') {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  const filledBars = Math.round(safeValue / 10);
  const emptyBars = 10 - filledBars;
  const progressBar = '🟩'.repeat(filledBars) + '⬜'.repeat(emptyBars);
  return {
    tag: 'div',
    text: {
      tag: 'lark_md',
      content: `${label}: ${progressBar} ${safeValue}%`
    }
  };
}

/**
 * 备注组件
 * @param {string} content - 备注内容
 */
function buildNote(content) {
  return {
    tag: 'div',
    text: {
      tag: 'lark_md',
      content
    }
  };
}

// ========== 交互类组件 ==========

/**
 * 按钮组件
 * @param {string} text - 按钮文本
 * @param {string} type - 按钮类型 (primary, default, danger)
 * @param {string} url - 跳转链接 (可选)
 * @param {string} value - 回传值 (可选)
 */
function buildButton(text, type = 'primary', url = null, value = null) {
  const button = {
    tag: 'button',
    text: {
      tag: 'plain_text',
      content: text
    },
    type,
    size: 'medium'
  };
  
  if (url) {
    button.url = url;
  }
  
  if (value) {
    button.behaviors = [{ type: 'callback', value: { value } }];
  }
  
  return button;
}

/**
 * 折叠按钮组
 * @param {Array} buttons - 按钮数组
 * @param {string} text - 折叠时显示的文本
 */
function buildOverflow(buttons, text = '更多操作') {
  return {
    tag: 'overflow',
    text: {
      tag: 'plain_text',
      content: text
    },
    elements: buttons
  };
}

/**
 * 输入框组件
 * @param {string} placeholder - 占位符
 * @param {string} name - 字段名
 */
function buildInput(placeholder = '请输入...', name = 'input_value') {
  return {
    tag: 'input',
    placeholder: {
      tag: 'plain_text',
      content: placeholder
    },
    name
  };
}

// ========== 容器类组件 ==========

/**
 * 分栏组件
 * @param {Array} columns - 列数组
 */
function buildColumnSet(columns) {
  return {
    tag: 'column_set',
    flex_mode: 'flow',
    columns
  };
}

/**
 * 构建分栏中的列
 * @param {Array} elements - 元素数组
 * @param {string} width - 宽度 (weighted, auto, 或百分比)
 */
function buildColumn(elements, width = 'weighted') {
  return {
    tag: 'column',
    width,
    elements
  };
}

/**
 * 折叠面板组件 (JSON 2.0 官方格式)
 * @param {string} title - 面板标题
 * @param {Array} children - 子元素数组 (markdown/div objects)
 * @param {boolean} expanded - 是否默认展开 (false = 折叠)
 */
function buildCollapsiblePanel(title, children = [], expanded = false) {
  if (!title) return null;

  return {
    tag: 'collapsible_panel',
    expanded: expanded,
    header: {
      title: {
        tag: 'plain_text',
        content: title
      },
      vertical_align: 'center',
      icon: {
        tag: 'standard_icon',
        token: 'down-small-ccm_outlined',
        size: '16px 16px'
      },
      icon_position: 'right',
      icon_expanded_angle: -180
    },
    border: {
      color: 'grey',
      corner_radius: '5px'
    },
    vertical_spacing: '8px',
    padding: '8px 8px 8px 8px',
    elements: children.length > 0 ? children : [{ tag: 'markdown', content: '暂无内容' }]
  };
}

// ========== 导出所有组件 ==========
export {
  // 展示类
  buildTitle,
  buildDiv,
  buildMarkdown,
  buildImage,
  buildImageCombination,
  buildDivider,
  buildProgress,
  buildNote,
  
  // 交互类
  buildButton,
  buildOverflow,
  buildInput,
  
  // 容器类
  buildColumnSet,
  buildColumn,
  buildCollapsiblePanel,
  
  // 快捷构建函数
  buildStepList,
  buildLogFold,
  buildFileList
};
