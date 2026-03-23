// 测试 2.2 - 演示完整的创建 + 更新流程
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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const token = await getTenantAccessToken();
  console.log('✅ Token 获取成功');
  
  // 步骤 1: 发送初始卡片（待处理）
  const card1 = {
    config: { wide_screen_mode: true },
    header: { template: 'blue', title: { tag: 'plain_text', content: '🧪 测试 2.2 - 卡片更新演示' } },
    elements: [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: '**状态**: ⏳ 待处理\n\n**子任务**:\n- [ ] 步骤 1: 初始化\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成\n\n---\n*3 秒后自动更新为"进行中"...*'
        }
      }
    ]
  };
  
  console.log('步骤 1: 发送初始卡片（待处理）...');
  const result1 = await sendCard(token, card1);
  if (result1.code !== 0) throw new Error(result1.msg);
  console.log('✅ 初始卡片发送成功，Message ID:', result1.data?.message_id);
  
  // 等待 3 秒
  console.log('等待 3 秒...');
  await sleep(3000);
  
  // 步骤 2: 发送更新后的卡片（进行中）
  const card2 = {
    config: { wide_screen_mode: true },
    header: { template: 'yellow', title: { tag: 'plain_text', content: '🧪 测试 2.2 - 卡片更新演示' } },
    elements: [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: '**状态**: 🛠️ 进行中\n\n**子任务**:\n- [x] 步骤 1: 初始化 ✅\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成\n\n---\n*已更新为"进行中"状态*'
        }
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: { tag: 'plain_text', content: '✅ 标记为完成' },
            type: 'primary',
            value: JSON.stringify({ action: 'mark_done' })
          }
        ]
      }
    ]
  };
  
  console.log('步骤 2: 发送更新后的卡片（进行中）...');
  const result2 = await sendCard(token, card2);
  if (result2.code !== 0) throw new Error(result2.msg);
  console.log('✅ 更新后卡片发送成功，Message ID:', result2.data?.message_id);
  console.log('\n✅ 测试 2.2 完成！卡片已从"待处理"更新为"进行中"！');
}

main().catch(console.error);
