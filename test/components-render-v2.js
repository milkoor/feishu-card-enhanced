import { readFileSync } from 'fs';

const GATEWAY_URL = 'http://localhost:18789/tools/invoke';
const TOKEN = '0841f11561c0640d7e0a9f75c246853e0b1b4e518b553a70';
const CHAT_ID = 'oc_fb5466a176c6ba097c0e331daf8fff1e';

async function invokeTool(tool, args) {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({ tool, args })
  });
  return response.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function test(name, taskData) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📤 [V2] ${name}`);
  console.log('='.repeat(60));
  const result = await invokeTool('task_card_create', {
    receive_id_type: 'chat_id',
    receive_id: CHAT_ID,
    task: taskData
  });
  if (result.ok && result.result?.message_id) {
    console.log(`✅ OK! message_id: ${result.result.message_id}`);
  } else {
    console.log(`❌ FAILED:`, JSON.stringify(result, null, 2));
  }
  return result;
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  飞书卡片组件渲染测试 V2 (JSON 2.0) - 开始执行        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const tests = [
    { name: 'V2-G1 基础文本 + 按钮', fn: () => test('V2-G1 基础文本 + 按钮', {
      title: '🧪 V2-G1 基础组件测试',
      titleTemplate: 'blue',
      messages: [
        { text: '--- V2 JSON 2.0 格式测试 ---', level: 'info' },
        { text: '✅ 卡片使用 schema: "2.0"', level: 'success' },
        { text: '✅ elements 在 body 内部', level: 'success' },
        { text: '✅ 按钮直接放在 elements 中', level: 'success' },
        { text: '✅ 按钮使用 behaviors: [{type: "callback"}]', level: 'success' },
      ],
      actions: [
        { text: '✅ 确认', action: 'confirm', type: 'primary' },
        { text: '继续 →', action: 'continue', type: 'default' },
      ]
    })},
    { name: 'V2-G2 危险按钮', fn: () => test('V2-G2 危险按钮', {
      title: '🧪 V2-G2 按钮类型测试',
      titleTemplate: 'red',
      messages: [
        { text: '--- 按钮类型测试 ---', level: 'info' },
        { text: '测试各种按钮类型渲染', level: 'info' }
      ],
      actions: [
        { text: '🔵 主要按钮', action: 'primary', type: 'primary' },
        { text: '⚫ 默认按钮', action: 'default', type: 'default' },
        { text: '🔴 危险按钮', action: 'danger', type: 'danger' },
      ]
    })},
    { name: 'V2-G3 子任务列表 (column_set)', fn: () => test('V2-G3 子任务列表', {
      title: '🧪 V2-G3 子任务列表测试',
      titleTemplate: 'green',
      subtasks: [
        { id: 's1', label: '环境准备', status: 'done' },
        { id: 's2', label: '代码编写', status: 'done' },
        { id: 's3', label: '测试验证', status: 'doing' },
        { id: 's4', label: '部署上线', status: 'todo' },
      ],
      messages: [
        { text: '✅ column_set + column JSON 2.0 格式', level: 'success' },
        { text: '✅ 每个子任务带 emoji 状态图标', level: 'success' },
        { text: '🔄 蓝色 = 进行中, ⏳ 灰色 = 待开始', level: 'info' }
      ]
    })},
    { name: 'V2-G4 Markdown 丰富内容', fn: () => test('V2-G4 Markdown', {
      title: '🧪 V2-G4 Markdown 丰富内容',
      titleTemplate: 'purple',
      messages: [
        { text: '--- Markdown 格式测试 ---', level: 'info' },
        { text: '**粗体文本** 和 *斜体文本* 测试', level: 'info' },
        { text: '行内代码: `const x = 1`', level: 'info' },
        { text: '链接: [飞书官网](https://open.feishu.cn)', level: 'info' },
        { text: '有序列表: 1. 第一步 2. 第二步 3. 第三步', level: 'info' },
        { text: '无序列表: - 项目A - 项目B - 项目C', level: 'info' },
        { text: '> 引用文本块测试', level: 'info' },
      ]
    })},
    { name: 'V2-G5 完整综合卡片', fn: () => test('V2-G5 完整卡片', {
      title: '🧪 V2-G5 完整综合卡片',
      titleTemplate: 'blue',
      subtasks: [
        { id: 's1', label: '需求分析', status: 'done' },
        { id: 's2', label: '系统设计', status: 'doing' },
        { id: 's3', label: '编码实现', status: 'todo' },
        { id: 's4', label: '测试验收', status: 'todo' },
        { id: 's5', label: '上线部署', status: 'todo' },
      ],
      messages: [
        { text: '🚀 项目启动成功', level: 'info', time: new Date().toISOString() },
        { text: '✅ 需求文档已完成', level: 'success', time: new Date().toISOString() },
        { text: '⚠️ 部分接口文档待补充', level: 'warn', time: new Date().toISOString() },
        { text: '🔄 正在进行系统设计...', level: 'info', time: new Date().toISOString() },
        { text: '❌ 数据库连接超时 (可重试)', level: 'error', time: new Date().toISOString() }
      ],
      actions: [
        { text: '🔄 重试', action: 'retry', type: 'primary' },
        { text: '继续 →', action: 'continue', type: 'default' },
        { text: '📋 查看详情', action: 'details', type: 'default' }
      ]
    })},
    { name: 'V2-G6 颜色模板全览', fn: () => test('V2-G6 颜色模板', {
      title: '🧪 V2-G6 标题颜色测试',
      titleTemplate: 'blue',
      messages: [
        { text: '--- 标题颜色模板测试 ---', level: 'info' },
        { text: '每个卡片可使用不同标题颜色', level: 'info' },
        { text: 'blue: 蓝色 (默认)', level: 'info' },
        { text: 'green: 绿色', level: 'success' },
        { text: 'yellow: 黄色', level: 'warn' },
        { text: 'red: 红色', level: 'error' },
        { text: 'orange: 橙色', level: 'info' },
        { text: 'purple: 紫色', level: 'info' },
        { text: 'grey: 灰色', level: 'info' },
      ]
    })},
  ];

  for (const t of tests) {
    await t.fn();
    await sleep(2000);
  }

  console.log('\n\n✅ V2 测试完成! 请在飞书 APP 中查看渲染效果.');
  console.log('对比旧卡片(V1)和新卡片(V2)的渲染差异:');
  console.log('  - V1: 元素堆叠在根部, action 包装器, progress 标签');
  console.log('  - V2: schema:2.0, body.elements 结构, 按钮直接放, div+lark_md');
}

main().catch(console.error);
