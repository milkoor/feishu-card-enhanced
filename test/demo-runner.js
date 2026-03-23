// 测试运行器 - 调用 task_card_create 创建测试卡片
import { randomUUID } from 'crypto';

const taskId = randomUUID();
const task = {
  task_id: taskId,
  title: '🧪 测试任务 #1 - 基础功能验证',
  titleTemplate: 'blue',
  lang: 'zh',
  status: 'todo',
  subtasks: [
    { id: 'step1', label: '环境准备', status: 'todo' },
    { id: 'step2', label: '代码部署', status: 'todo' },
    { id: 'step3', label: '功能验证', status: 'todo' }
  ],
  messages: [
    { text: '测试任务已创建', level: 'info', time: new Date().toISOString() }
  ],
  actions: [
    { text: '开始测试', action: 'start_test', type: 'primary', payload: {} },
    { text: '跳过', action: 'skip', type: 'default', payload: {} }
  ]
};

console.log('创建测试卡片:', JSON.stringify({
  task_id: taskId,
  title: task.title,
  status: task.status,
  subtasks: task.subtasks.length,
  messages: task.messages.length,
  actions: task.actions.length
}, null, 2));

// 输出任务数据供后续调用
console.log('\n任务数据:', JSON.stringify(task, null, 2));
