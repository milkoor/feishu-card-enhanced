/**
 * 飞书卡片组件渲染测试
 * 测试所有组件在飞书 APP 中的实际渲染效果
 * 
 * 使用方式: node test/components-render-feishu.js
 * 需要先确保 gateway 运行中
 */

import { readFileSync } from 'fs';

// ============ 配置 ============
const GATEWAY_URL = 'http://localhost:18789/tools/invoke';
const TOKEN = '0841f11561c0640d7e0a9f75c246853e0b1b4e518b553a70';
const CHAT_ID = 'oc_fb5466a176c6ba097c0e331daf8fff1e';

// ============ 工具函数 ============
async function invokeTool(tool, args) {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ tool, args })
  });
  const result = await response.json();
  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testComponent(name, taskData) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📤 发送测试卡片: ${name}`);
  console.log(`   标题: ${taskData.title}`);
  console.log('='.repeat(60));
  
  try {
    const result = await invokeTool('task_card_create', {
      receive_id_type: 'chat_id',
      receive_id: CHAT_ID,
      task: taskData
    });
    
    if (result.ok && result.result?.message_id) {
      console.log(`✅ 发送成功! message_id: ${result.result.message_id}`);
    } else {
      console.log(`❌ 发送失败:`, JSON.stringify(result, null, 2));
    }
    return result;
  } catch (e) {
    console.log(`❌ 请求失败: ${e.message}`);
    return { error: e.message };
  }
}

// ============ 测试组件组 ============

// Group 1: 基础文本组件
async function testBasicComponents() {
  return testComponent('G1-基础文本组件', {
    title: '🧪 G1 基础文本组件测试',
    titleTemplate: 'blue',
    messages: [
      { text: '--- G1: 基础组件测试 ---', level: 'info' },
      { text: '测试 div + lark_md 文本', level: 'info' },
      { text: '测试 markdown 渲染 **粗体** 和 *斜体*', level: 'info' },
      { text: '测试有序列表: 1. 第一步 2. 第二步', level: 'info' },
      { text: '测试代码块: `const x = 1`', level: 'info' },
    ]
  });
}

// Group 2: 操作按钮
async function testButtons() {
  return testComponent('G2-操作按钮', {
    title: '🧪 G2 按钮组件测试',
    titleTemplate: 'green',
    messages: [
      { text: '--- G2: 按钮组件测试 ---', level: 'info' },
      { text: '测试 primary 默认 danger 按钮', level: 'info' },
    ],
    actions: [
      { text: '✅ 确认', action: 'confirm', type: 'primary' },
      { text: '继续 →', action: 'continue', type: 'default' },
      { text: '⚠️ 删除', action: 'delete', type: 'danger' },
      { text: '↗️ 打开链接', action: 'open_url', type: 'default', url: 'https://open.feishu.cn' }
    ]
  });
}

// Group 3: 分栏布局 (column_set - 可能不支持)
async function testColumnSet() {
  return testComponent('G3-分栏布局(column_set)', {
    title: '🧪 G3 分栏布局测试',
    titleTemplate: 'purple',
    messages: [
      { text: '--- G3: column_set 分栏测试 ---', level: 'info' },
      { text: '此组件在飞书可能不被支持', level: 'info' }
    ]
  });
}

// Group 4: 进度条 (progress - 已知不支持)
async function testProgress() {
  return testComponent('G4-进度条(progress)', {
    title: '🧪 G4 进度条组件测试',
    titleTemplate: 'orange',
    messages: [
      { text: '--- G4: progress 进度条测试 ---', level: 'info' },
      { text: '⚠️ progress 标签在飞书不支持', level: 'warning' },
      { text: '预期: 整行可能被忽略或报错', level: 'info' }
    ]
  });
}

// Group 5: 折叠面板 (fold - 可能不支持)
async function testFold() {
  return testComponent('G5-折叠面板(fold)', {
    title: '🧪 G5 折叠面板测试',
    titleTemplate: 'red',
    messages: [
      { text: '--- G5: fold 折叠组件测试 ---', level: 'info' },
      { text: '⚠️ fold 标签在飞书不支持', level: 'warning' },
      { text: '使用 div + markdown 作为替代方案', level: 'info' }
    ]
  });
}

// Group 6: 子任务列表
async function testSubtasks() {
  return testComponent('G6-子任务列表', {
    title: '🧪 G6 子任务列表测试',
    titleTemplate: 'blue',
    subtasks: [
      { id: 's1', label: '步骤 1: 环境准备', status: 'done' },
      { id: 's2', label: '步骤 2: 代码编写', status: 'done' },
      { id: 's3', label: '步骤 3: 测试验证', status: 'doing' },
      { id: 's4', label: '步骤 4: 部署上线', status: 'todo' },
    ],
    messages: [
      { text: '--- G6: 子任务列表测试 ---', level: 'info' },
      { text: '✅ 绿色 = 已完成, 🔄 蓝色 = 进行中, ⏳ 灰色 = 待开始', level: 'info' }
    ]
  });
}

// Group 7: 完整综合卡片
async function testFullCard() {
  return testComponent('G7-完整综合卡片', {
    title: '🧪 G7 完整综合卡片测试',
    titleTemplate: 'blue',
    subtasks: [
      { id: 's1', label: '环境准备', status: 'done' },
      { id: 's2', label: '功能开发', status: 'doing' },
      { id: 's3', label: '测试验证', status: 'todo' }
    ],
    messages: [
      { text: '🚀 项目启动', level: 'info', time: new Date().toISOString() },
      { text: '✅ 环境配置完成', level: 'success', time: new Date().toISOString() },
      { text: '⚠️ 发现潜在问题，已记录', level: 'warning', time: new Date().toISOString() },
      { text: '🔄 正在进行功能开发...', level: 'info', time: new Date().toISOString() },
      { text: '❌ 连接超时 (可重试)', level: 'error', time: new Date().toISOString() }
    ],
    actions: [
      { text: '🔄 重试', action: 'retry', type: 'primary' },
      { text: '继续 →', action: 'continue', type: 'default' }
    ]
  });
}

// Group 8: 各种标题颜色模板
async function testColorTemplates() {
  return testComponent('G8-标题颜色模板', {
    title: '🧪 G8 标题颜色测试',
    titleTemplate: 'blue',
    messages: [
      { text: '--- G8: 标题颜色模板 ---', level: 'info' },
      { text: '`blue` 蓝色标题 (默认)', level: 'info' },
      { text: '[green] 绿色标签测试', level: 'success' },
      { text: '[yellow] 黄色警告测试', level: 'warning' },
      { text: '[red] 红色错误测试', level: 'error' },
      { text: '[orange] 橙色提示', level: 'info' },
      { text: '[purple] 紫色特殊', level: 'info' },
      { text: '[grey] 灰色次要', level: 'info' }
    ]
  });
}

// ============ 主流程 ============
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       飞书卡片组件渲染测试 - 开始执行                    ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`Gateway: ${GATEWAY_URL}`);
  console.log(`Chat ID: ${CHAT_ID}`);
  console.log('');
  
  const tests = [
    { name: 'G1-基础文本', fn: testBasicComponents },
    { name: 'G2-操作按钮', fn: testButtons },
    { name: 'G3-分栏布局', fn: testColumnSet },
    { name: 'G4-进度条', fn: testProgress },
    { name: 'G5-折叠面板', fn: testFold },
    { name: 'G6-子任务列表', fn: testSubtasks },
    { name: 'G7-完整综合', fn: testFullCard },
    { name: 'G8-颜色模板', fn: testColorTemplates },
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await test.fn();
    results.push({ name: test.name, result });
    
    // 等待 2 秒，避免请求过快
    await sleep(2000);
  }
  
  // 汇总
  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('═'.repeat(60));
  
  for (const r of results) {
    const ok = r.result?.ok === true && r.result?.result?.success;
    console.log(`${ok ? '✅' : '❌'} ${r.name}: ${ok ? 'OK' : 'FAILED'}`);
    if (!ok && r.result?.result?.feishu?.error) {
      console.log(`   飞书错误: ${r.result.result.feishu.error}`);
    }
  }
  
  console.log('\n请在飞书 APP 中查看每张卡片的渲染效果。');
  console.log('测试脚本完成.');
}

main().catch(console.error);
