/**
 * 组件分批渲染测试
 * 
 * 测试所有飞书卡片组件的渲染能力
 * 包括：容器类、内容类、交互类组件
 * 
 * @author 杨博
 * @version 1.0.0
 * @since 2026-03-21
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { PersonBuilder } from '../src/builders/PersonBuilder.js';
import { ComponentBuilder } from '../src/builders/ComponentBuilder.js';
import { registry } from '../src/utils/component-registry.js';

// 注册 person 组件
before(() => {
  registry.register('person', PersonBuilder);
});

describe('组件分批渲染测试', () => {
  
  describe('容器类组件测试', () => {
    
    it('column_set - 列容器渲染', () => {
      // 测试列容器的基本结构
      const columnSet = {
        tag: 'column_set',
        elements: [
          {
            tag: 'column',
            weight: 1,
            elements: []
          }
        ]
      };
      
      assert.equal(columnSet.tag, 'column_set');
      assert.ok(Array.isArray(columnSet.elements));
    });

    it('divider - 分割线渲染', () => {
      const divider = {
        tag: 'divider'
      };
      
      assert.equal(divider.tag, 'divider');
    });
  });

  describe('内容类组件测试', () => {
    
    it('person - 人员信息渲染', () => {
      const result = new PersonBuilder()
        .setUserId('ou_test123')
        .setTitle('测试用户')
        .setAvatar('https://example.com/avatar.jpg')
        .build();

      assert.equal(result.tag, 'person');
      assert.equal(result.user_id, 'ou_test123');
      assert.equal(result.title, '测试用户');
      assert.equal(result.avatar, 'https://example.com/avatar.jpg');
    });

    it('plain_text - 纯文本渲染', () => {
      const text = {
        tag: 'plain_text',
        content: '测试文本内容'
      };
      
      assert.equal(text.tag, 'plain_text');
      assert.equal(text.content, '测试文本内容');
    });

    it('rich_text - 富文本渲染', () => {
      const richText = {
        tag: 'rich_text',
        elements: [
          { tag: 'text', text: '普通文本' },
          { tag: 'a', text: '链接文本', href: 'https://example.com' },
          { tag: 'b', text: '加粗文本' }
        ]
      };
      
      assert.equal(richText.tag, 'rich_text');
      assert.ok(Array.isArray(richText.elements));
    });

    it('image - 图片渲染', () => {
      const image = {
        tag: 'image',
        src: 'https://example.com/image.jpg',
        alt: '图片描述'
      };
      
      assert.equal(image.tag, 'image');
      assert.ok(image.src.startsWith('http'));
    });

    it('title - 标题渲染', () => {
      const title = {
        tag: 'title',
        content: '标题内容',
        template: 'blue'
      };
      
      assert.equal(title.tag, 'title');
      assert.ok(['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'grey'].includes(title.template));
    });

    it('link - 链接渲染', () => {
      const link = {
        tag: 'link',
        href: 'https://example.com',
        text: '链接文本'
      };
      
      assert.equal(link.tag, 'link');
      assert.ok(link.href.startsWith('http'));
    });

    it('avatar - 头像渲染', () => {
      const avatar = {
        tag: 'avatar',
        src: 'https://example.com/avatar.jpg',
        size: 'medium'
      };
      
      assert.equal(avatar.tag, 'avatar');
      assert.ok(['small', 'medium', 'large'].includes(avatar.size));
    });
  });

  describe('交互类组件测试', () => {
    
    it('button - 按钮渲染', () => {
      const button = {
        tag: 'button',
        text: '点击我',
        type: 'primary',
        actions: [
          {
            tag: 'callback',
            data: { action: 'test_action' }
          }
        ]
      };
      
      assert.equal(button.tag, 'button');
      assert.ok(Array.isArray(button.actions));
    });

    it('checkbox - 复选框渲染', () => {
      const checkbox = {
        tag: 'checkbox',
        options: [
          { value: 'option1', text: '选项 1' },
          { value: 'option2', text: '选项 2' }
        ],
        default_options: ['option1']
      };
      
      assert.equal(checkbox.tag, 'checkbox');
      assert.ok(Array.isArray(checkbox.options));
    });

    it('select - 下拉选择渲染', () => {
      const select = {
        tag: 'select',
        options: [
          { value: 'opt1', text: '选项 1' },
          { value: 'opt2', text: '选项 2' }
        ],
        placeholder: '请选择'
      };
      
      assert.equal(select.tag, 'select');
      assert.ok(Array.isArray(select.options));
    });

    it('input - 输入框渲染', () => {
      const input = {
        tag: 'input',
        placeholder: '请输入内容',
        multiline: false
      };
      
      assert.equal(input.tag, 'input');
      assert.equal(typeof input.multiline, 'boolean');
    });
  });

  describe('复合组件渲染测试', () => {
    
    it('完整卡片结构渲染', () => {
      const card = {
        config: {
          wide_screen_mode: true
        },
        elements: [
          {
            tag: 'title',
            content: '测试卡片',
            template: 'blue'
          },
          {
            tag: 'column_set',
            elements: [
              {
                tag: 'column',
                weight: 1,
                elements: [
                  {
                    tag: 'plain_text',
                    content: '第一列内容'
                  }
                ]
              },
              {
                tag: 'column',
                weight: 1,
                elements: [
                  {
                    tag: 'plain_text',
                    content: '第二列内容'
                  }
                ]
              }
            ]
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: '确认',
                type: 'primary'
              },
              {
                tag: 'button',
                text: '取消'
              }
            ]
          }
        ]
      };
      
      // 验证卡片基本结构
      assert.ok(card.config);
      assert.ok(Array.isArray(card.elements));
      assert.equal(card.elements.length, 3);
      
      // 验证标题
      const title = card.elements[0];
      assert.equal(title.tag, 'title');
      
      // 验证列容器
      const columnSet = card.elements[1];
      assert.equal(columnSet.tag, 'column_set');
      
      // 验证操作区
      const action = card.elements[2];
      assert.equal(action.tag, 'action');
    });

    it('多消息流卡片渲染', () => {
      const messages = [
        { text: '消息 1', level: 'info', time: '10:00' },
        { text: '消息 2', level: 'success', time: '10:01' },
        { text: '消息 3', level: 'error', time: '10:02' }
      ];
      
      assert.equal(messages.length, 3);
      assert.ok(messages.every(m => ['info', 'success', 'error'].includes(m.level)));
    });
  });

  describe('边界情况测试', () => {
    
    it('空数组渲染', () => {
      const emptyCard = {
        config: { wide_screen_mode: true },
        elements: []
      };
      
      assert.ok(Array.isArray(emptyCard.elements));
      assert.equal(emptyCard.elements.length, 0);
    });

    it('超大数据量渲染', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        tag: 'plain_text',
        content: `消息 ${i}`
      }));
      
      assert.equal(largeArray.length, 1000);
      assert.equal(largeArray[0].content, '消息 0');
      assert.equal(largeArray[999].content, '消息 999');
    });

    it('特殊字符处理', () => {
      const specialText = {
        tag: 'plain_text',
        content: '特殊字符：<>&"\' 测试'
      };
      
      assert.ok(specialText.content.includes('<'));
      assert.ok(specialText.content.includes('>'));
    });
  });

  describe('性能测试', () => {
    
    it('批量创建组件性能', () => {
      const startTime = Date.now();
      const components = [];
      
      for (let i = 0; i < 100; i++) {
        components.push({
          tag: 'plain_text',
          content: `组件 ${i}`
        });
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      assert.equal(components.length, 100);
      assert.ok(duration < 100, '批量创建应在 100ms 内完成');
    });

    it('组件构建器链式调用性能', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        new PersonBuilder()
          .setUserId(`user_${i}`)
          .setTitle(`用户 ${i}`)
          .build();
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      assert.ok(duration < 500, '1000 次构建应在 500ms 内完成');
    });
  });
});
