/**
 * 修复标题颜色问题
 * 飞书卡片的标题颜色可能需要使用不同的格式
 */

// 方案 1: 使用 header 的 template 字段（标准方式）
const card1 = {
  config: { wide_screen_mode: true },
  header: {
    template: 'blue', // blue, green, red, yellow, orange, purple, grey
    title: {
      tag: 'plain_text',
      content: '🧪 测试 - 蓝色标题'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '这是测试内容'
      }
    }
  ]
};

// 方案 2: 使用 title 元素（不使用 header）
const card2 = {
  config: { wide_screen_mode: true },
  elements: [
    {
      tag: 'title',
      content: '🧪 测试 - 蓝色标题',
      template: 'blue'
    },
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '这是测试内容'
      }
    }
  ]
};

// 方案 3: 完整格式（header + 颜色）
const card3 = {
  config: {
    wide_screen_mode: true,
    style: {
      'color': 'blue'
    }
  },
  header: {
    template: 'blue',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 - 蓝色标题'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '这是测试内容'
      }
    }
  ]
};

import { writeFileSync } from 'fs';
writeFileSync('./test/header-formats.json', JSON.stringify({ card1, card2, card3 }, null, 2));
console.log('已生成 3 种标题格式，请测试哪种有效');
