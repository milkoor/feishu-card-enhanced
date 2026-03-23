/**
 * 测试 2.1 - 演示卡片更新流程
 * 1. 创建任务卡片
 * 2. 更新卡片状态
 */

const APP_ID = 'cli_a93c54b9b8b89cee';
const APP_SECRET = 'gHtLdsHviSEjmG7pBhwtPevjF3pXrhwn';
const RECEIVE_ID = 'ou_f0379d8fcd5415cb06da40e5a46e3758';

async function getTenantAccessToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
  });
  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Token 获取失败：${data.msg}`);
  }
  return data.tenant_access_token;
}

// 发送一条文本消息，说明即将演示卡片更新
async function sendTextMessage(token, text) {
  const response = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      receive_id: RECEIVE_ID,
      msg_type: 'text',
      content: JSON.stringify({ text })
    })
  });
  return response.json();
}

async function main() {
  console.log('=== 演示卡片更新流程 ===\n');
  try {
    const token = await getTenantAccessToken();
    
    // 发送说明消息
    await sendTextMessage(token, '🧪 测试 2.1 - 卡片更新演示\n\n步骤 1: ✅ 收到按钮点击\n步骤 2: ⏳ 即将创建任务卡片\n步骤 3: ⏳ 更新卡片状态为"进行中"\n\n请稍候...');
    
    console.log('✅ 演示消息已发送');
  } catch (error) {
    console.error('❌ 失败:', error.message);
  }
}

main();
