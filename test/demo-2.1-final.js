// 测试 2.1 - 最终版本：演示完整更新流程
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
  if (data.code !== 0) throw new Error(data.msg);
  return data.tenant_access_token;
}

async function sendCard(token, cardData) {
  const response = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
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
  return response.json();
}

async function main() {
  const token = await getTenantAccessToken();
  
  // 卡片 1: 待处理状态
  const card1 = {
    config: { wide_screen_mode: true },
    header: {
      template: 'blue',
      title: { tag: 'plain_text', content: '🧪 测试 2.1 - 卡片更新演示' }
    },
    elements: [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: '**当前状态**: ⏳ 待处理\n\n**子任务进度**:\n- [ ] 步骤 1: 初始化\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成\n\n---\n*点击下方按钮更新状态*'
        }
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '▶️ 更新为进行中' },
            type: 'primary',
            value: JSON.stringify({ action: 'update_to_doing', step: 1 })
          }
        ]
      }
    ]
  };
  
  const result = await sendCard(token, card1);
  if (result.code !== 0) throw new Error(result.msg);
  console.log('✅ 测试卡片 2.1 发送成功！Message ID:', result.data?.message_id);
}

main().catch(console.error);
