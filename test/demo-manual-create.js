// 手动创建任务卡片的测试脚本
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

async function main() {
  const token = await getTenantAccessToken();
  console.log('✅ Token 获取成功');
  
  // 发送一条说明消息
  const textResponse = await fetch('https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      receive_id: RECEIVE_ID,
      msg_type: 'text',
      content: JSON.stringify({ text: '🧪 测试 2.1 - 卡片更新演示\n\n任务已创建，状态：待处理\n\n子任务:\n- [ ] 步骤 1: 初始化\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成\n\n下一步：调用 update 工具更新状态为"进行中"' })
    })
  });
  
  const textResult = await textResponse.json();
  if (textResult.code !== 0) throw new Error(textResult.msg);
  console.log('✅ 说明消息发送成功');
}

main().catch(console.error);
