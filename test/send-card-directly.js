/**
 * 直接调用飞书 API 发送互动卡片
 * 使用正确的消息格式
 */

import { readFileSync } from 'fs';

// 读取配置
const configPath = '/home/mk/.openclaw/config.json';
let appId = 'cli_xxx';
let appSecret = 'xxx';

try {
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  appId = config.channels?.feishu?.appId || appId;
  appSecret = config.channels?.feishu?.appSecret || appSecret;
} catch (e) {
  console.log('未找到配置文件，使用占位符');
}

// 测试卡片 - 使用 title 元素
const testCard = {
  config: {
    wide_screen_mode: true
  },
  elements: [
    {
      tag: 'title',
      content: '🧪 测试 1.1 - 卡片基础生成',
      template: 'blue'
    },
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证飞书卡片 JSON 结构能正确渲染\n\n**预期结果**:\n- ✅ 标题显示为蓝色\n- ✅ 文本内容正常显示\n\n---\n*请确认卡片是否正常显示*'
      }
    }
  ]
};

// 发送消息的完整格式
const messagePayload = {
  receive_id: 'ou_f0379d8fcd5415cb06da40e5a46e3758', // 接收者 ID
  receive_id_type: 'open_id',
  msg_type: 'interactive',
  content: JSON.stringify(testCard)
};

console.log('=== 飞书互动卡片发送参数 ===\n');
console.log('接收者 ID:', messagePayload.receive_id);
console.log('消息类型:', messagePayload.msg_type);
console.log('卡片内容 (JSON):', messagePayload.content);
console.log('\n=== 下一步 ===');
console.log('调用飞书 API: POST /open-apis/im/v1/messages');
console.log('或使用 OpenClaw 工具：task_card_create');
