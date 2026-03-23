/**
 * 测试 2.1 - 卡片动态更新
 * 发送一张带子任务和按钮的卡片
 */

const APP_ID = 'cli_a93c54b9b8b89cee';
const APP_SECRET = 'gHtLdsHviSEjmG7pBhwtPevjF3pXrhwn';
const RECEIVE_ID = 'ou_f0379d8fcd5415cb06da40e5a46e3758'; // 博哥的 open_id

// 测试卡片 2.1 - 带子任务的任务卡片
const testCard21 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'blue',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 2.1 - 卡片动态更新'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**任务**: 验证卡片能动态更新\n\n**子任务进度**:\n- [ ] 步骤 1: 初始化\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成\n\n**当前状态**: ⏳ 待处理\n\n---\n*请点击按钮开始测试*'
      }
    },
    {
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '🚀 开始执行'
          },
          type: 'primary',
          value: JSON.stringify({
            action: 'test_2_1_start',
            task_id: 'test_task_21',
            timestamp: Date.now()
          })
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '✅ 标记完成'
          },
          type: 'default',
          value: JSON.stringify({
            action: 'test_2_1_complete',
            task_id: 'test_task_21',
            timestamp: Date.now()
          })
        }
      ]
    }
  ]
};

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
  console.log('✅ Token 获取成功');
  return data.tenant_access_token;
}

async function sendInteractiveCard(token, cardData) {
  const messageResponse = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      receive_id: RECEIVE_ID,
      msg_type: 'interactive',
      content: JSON.stringify(cardData)
    })
  });
  const messageResult = await messageResponse.json();
  if (messageResult.code !== 0) {
    throw new Error(`消息发送失败：${messageResult.msg} (code: ${messageResult.code})`);
  }
  console.log('✅ 卡片发送成功，Message ID:', messageResult.data.message_id);
  return messageResult.data.message_id;
}

async function main() {
  console.log('=== 测试 2.1 - 卡片动态更新 ===\n');
  try {
    const token = await getTenantAccessToken();
    console.log('发送测试卡片 2.1...');
    const messageId = await sendInteractiveCard(token, testCard21);
    console.log('\n✅ 测试卡片 2.1 发送成功！');
    console.log('消息 ID:', messageId);
    console.log('\n请点击 "🚀 开始执行" 或 "✅ 标记完成" 按钮测试更新功能');
  } catch (error) {
    console.error('\n❌ 发送失败:', error.message);
    process.exit(1);
  }
}

main();
