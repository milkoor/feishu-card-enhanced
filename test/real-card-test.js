/**
 * 真实卡片测试 - 发送到飞书对话
 * 
 * 使用方法：
 * 1. 确保飞书配置正确 (appId/appSecret)
 * 2. 运行：node test/real-card-test.js
 */

import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 生成测试卡片数据
function createTestCardData(testNumber, title, status = 'todo') {
  return {
    task_id: randomUUID(),
    title: title,
    titleTemplate: status === 'error' ? 'red' : 'blue',
    lang: 'zh',
    status: status,
    subtasks: [
      { id: 'step1', label: '环境准备', status: status === 'todo' ? 'todo' : 'done' },
      { id: 'step2', label: '代码部署', status: status },
      { id: 'step3', label: '功能验证', status: status }
    ],
    messages: [
      { text: `测试任务 #${testNumber} 已创建`, level: 'info', time: new Date().toISOString() }
    ],
    actions: [
      { text: '开始测试', action: 'start_test', type: 'primary', payload: { testNumber } },
      { text: '跳过', action: 'skip', type: 'default', payload: {} }
    ]
  };
}

// 构建飞书卡片 JSON
function buildCardJson(taskData) {
  const progress = taskData.subtasks.length > 0 
    ? Math.round((taskData.subtasks.filter(s => s.status === 'done').length / taskData.subtasks.length) * 100)
    : 0;

  return {
    config: {
      wide_screen_mode: true
    },
    header: {
      template: taskData.titleTemplate || 'blue',
      title: {
        tag: 'plain_text',
        content: taskData.title
      }
    },
    elements: [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: `**状态**: ${taskData.status}\\n**进度**: ${progress}%`
        }
      },
      {
        tag: 'action',
        actions: taskData.actions.map(action => ({
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: action.text
          },
          type: action.type === 'primary' ? 'primary' : 'default',
          value: JSON.stringify({
            action: action.action,
            task_id: taskData.task_id,
            ...action.payload
          })
        }))
      }
    ]
  };
}

// 主函数
async function runTest() {
  console.log('=== 真实卡片测试 ===\n');

  // 测试 1: 基础卡片
  const test1Data = createTestCardData(1, '🧪 测试 #1 - 基础功能验证');
  const test1Card = buildCardJson(test1Data);
  
  console.log('测试 1: 基础卡片');
  console.log('任务 ID:', test1Data.task_id);
  console.log('标题:', test1Data.title);
  console.log('状态:', test1Data.status);
  console.log('子任务数:', test1Data.subtasks.length);
  console.log('操作按钮:', test1Data.actions.length);
  console.log('卡片 JSON:', JSON.stringify(test1Card, null, 2));
  console.log('\n');

  // 测试 2: 错误状态卡片
  const test2Data = createTestCardData(2, '🧪 测试 #2 - 错误状态', 'error');
  test2Data.messages.push({ text: '模拟错误：连接超时', level: 'error', time: new Date().toISOString() });
  const test2Card = buildCardJson(test2Data);
  
  console.log('测试 2: 错误状态卡片');
  console.log('任务 ID:', test2Data.task_id);
  console.log('标题:', test2Data.title);
  console.log('状态:', test2Data.status);
  console.log('卡片 JSON:', JSON.stringify(test2Card, null, 2));
  console.log('\n');

  // 保存测试结果
  const resultFile = join(__dirname, 'test-results.json');
  writeFileSync(resultFile, JSON.stringify({
    test1: { data: test1Data, card: test1Card },
    test2: { data: test2Data, card: test2Card }
  }, null, 2));

  console.log('✅ 测试结果已保存到:', resultFile);
  console.log('\n下一步：调用飞书 API 发送卡片到对话');
}

runTest().catch(console.error);
