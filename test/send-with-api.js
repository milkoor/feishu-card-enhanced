/**
 * 使用飞书 API 直接发送互动卡片
 */

const APP_ID = 'cli_a93c54b9b8b89cee';
const APP_SECRET = 'gHtLdsHviSEjmG7pBhwtPevjF3pXrhwn';
const RECEIVE_ID = 'ou_f0379d8fcd5415cb06da40e5a46e3758'; // 博哥的 open_id

// 测试卡片 1.1 - 基础生成 (使用飞书官方格式)
const testCard11 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'blue',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 1.1 - 卡片基础生成'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证飞书卡片 JSON 结构能正确渲染\n\n**预期结果**:\n- ✅ 标题显示为蓝色\n- ✅ 文本内容正常显示\n\n---\n*请确认卡片是否正常显示*'
      }
    }
  ]
};

// 测试卡片 1.2 - 按钮组件
const testCard12 = {
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'green',
    title: {
      tag: 'plain_text',
      content: '🧪 测试 1.2 - 按钮组件'
    }
  },
  elements: [
    {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: '**测试目标**: 验证按钮组件能正常显示\n\n**按钮类型**:\n- `primary` - 主要按钮（蓝色）\n- `default` - 默认按钮（白色）\n\n---\n*请点击按钮测试*'
      }
    },
    {
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '✅ 测试成功'
          },
          type: 'primary',
          value: JSON.stringify({
            action: 'test_1_2_success',
            test_id: '1.2',
            timestamp: Date.now()
          })
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: '❌ 测试失败'
          },
          type: 'default',
          value: JSON.stringify({
            action: 'test_1_2_fail',
            test_id: '1.2',
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
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: APP_ID,
      app_secret: APP_SECRET
    })
  });
  
  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Token 获取失败：${data.msg}`);
  }
  
  console.log('✅ Token 获取成功');
  return data.tenant_access_token;
}

async function sendInteractiveCard(token, cardData) {
  // 直接使用 interactive 消息类型发送完整卡片内容
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

// 主函数 - 发送指定测试卡片
async function main(testNumber = '1.1') {
  console.log(`=== 发送测试卡片 ${testNumber} ===\n`);
  
  try {
    // 1. 获取 Token
    const token = await getTenantAccessToken();
    
    // 2. 选择要发送的测试卡片
    let cardData;
    let testName;
    
    if (testNumber === '1.1') {
      cardData = testCard11;
      testName = '基础生成';
    } else if (testNumber === '1.2') {
      cardData = testCard12;
      testName = '按钮组件';
    } else {
      throw new Error(`未知测试编号：${testNumber}`);
    }
    
    // 3. 发送卡片
    console.log(`发送测试卡片 ${testNumber} - ${testName}...`);
    const messageId = await sendInteractiveCard(token, cardData);
    
    console.log(`\n✅ 测试卡片 ${testNumber} 发送成功！`);
    console.log('消息 ID:', messageId);
    
  } catch (error) {
    console.error('\n❌ 发送失败:', error.message);
    process.exit(1);
  }
}

// 从命令行参数获取测试编号
const testNum = process.argv[2] || '1.1';
main(testNum);
