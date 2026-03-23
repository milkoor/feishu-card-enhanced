/**
 * 步骤 1: 基础卡片生成测试
 * 只测试卡片生成，不包含按钮
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 测试卡片 1.1 - 基础卡片（无按钮）
const card11 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'blue',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 1.1 - 卡片基础生成'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证飞书卡片 JSON 结构能正确渲染\n\n**预期结果**:\n- ✅ 标题显示为蓝色\n- ✅ 文本内容正常显示\n- ✅ 无格式错误'
      }
    },
    {
      tag: 'hr'
    },
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '*如果卡片正常显示，请点击下方按钮*'
      }
    }
  ]
};

// 测试卡片 1.2 - 只有按钮组件
const card12 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'green',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 1.2 - 按钮组件'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证按钮组件能正常显示\n\n**按钮类型**:\n- `primary` - 主要按钮（蓝色）\n- `default` - 默认按钮（白色）'
      }
    },
    {
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '✅ 测试成功'
          },
          type: 'primary',
          value: JSON.stringify({
            action: 'test_1_2_success',
            test_id: '1.2',
            timestamp: Date.now()
          })
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '❌ 测试失败'
          },
          type: 'default',
          value: JSON.stringify({
            action: 'test_1_2_fail',
            test_id: '1.2',
            timestamp: Date.now()
          })
        }
      ]
    }
  ]
};

// 测试卡片 1.3 - 动作回调测试
const card13 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'orange',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 1.3 - 动作回调'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证按钮点击后的回调处理\n\n**点击任意按钮将触发回调**:\n- 系统会收到按钮的 value 数据\n- 解析 action 字段\n- 执行对应处理逻辑'
      }
    },
    {
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '🔵 蓝色按钮'
          },
          type: 'primary',
          value: JSON.stringify({
            action: 'test_1_3_blue',
            test_id: '1.3',
            color: 'blue',
            timestamp: Date.now()
          })
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '🟢 绿色按钮'
          },
          type: 'default',
          value: JSON.stringify({
            action: 'test_1_3_green',
            test_id: '1.3',
            color: 'green',
            timestamp: Date.now()
          })
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '🔴 红色按钮'
          },
          type: 'default',
          value: JSON.stringify({
            action: 'test_1_3_red',
            test_id: '1.3',
            color: 'red',
            timestamp: Date.now()
          })
        }
      ]
    }
  ]
};

// 保存测试结果
const resultFile = join(__dirname, 'step1-results.json');
writeFileSync(resultFile, JSON.stringify({
  '1.1': card11,
  '1.2': card12,
  '1.3': card13
}, null, 2));

console.log('✅ 步骤 1 测试卡片已生成');
console.log('文件位置:', resultFile);
console.log('\n卡片数量:', 3);
console.log('  - 1.1: 基础卡片（无按钮）');
console.log('  - 1.2: 按钮组件测试');
console.log('  - 1.3: 动作回调测试');
