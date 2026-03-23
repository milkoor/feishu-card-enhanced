/**
 * 测试新的 collapsible_panel 组件
 */
import { buildLogFold, buildFileList, buildCollapsiblePanel } from '../src/components/index.js';

const GATEWAY = 'http://localhost:18789/tools/invoke';
const TOKEN = '0841f11561c0640d7e0a9f75c246853e0b1b4e518b553a70';
const CHAT_ID = 'oc_fb5466a176c6ba097c0e331daf8fff1e';

async function invoke(tool, args) {
  const res = await fetch(GATEWAY, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, args })
  });
  return res.json();
}

async function main() {
  // Test 1: buildLogFold (collapsible_panel)
  const logFold = buildLogFold(['初始化完成', '处理数据中...', '验证结果成功'], false);
  console.log('buildLogFold:', JSON.stringify(logFold, null, 2));

  // Test 2: buildFileList (collapsible_panel)
  const fileList = buildFileList([
    { name: 'report.pdf', share_url: 'https://example.com/report.pdf' },
    { name: 'output.json', share_url: 'https://example.com/output.json' }
  ]);
  console.log('\nbuildFileList:', JSON.stringify(fileList, null, 2));

  // Test 3: buildCollapsiblePanel
  const panel = buildCollapsiblePanel('详细信息', [
    { tag: 'markdown', content: '这是面板内的详细内容\n支持 **Markdown** 格式' }
  ], true);
  console.log('\nbuildCollapsiblePanel:', JSON.stringify(panel, null, 2));

  // Build full JSON 2.0 card
  const card = {
    schema: '2.0',
    header: {
      template: 'blue',
      title: { tag: 'plain_text', content: '🧪 JSON 2.0 + collapsible_panel 测试' }
    },
    body: {
      elements: [
        { tag: 'markdown', content: '**官方 collapsible_panel 组件测试 (JSON 2.0)**' },
        logFold,
        fileList,
        panel,
        { tag: 'markdown', content: '✅ 所有组件使用官方 JSON 2.0 格式' }
      ]
    }
  };

  console.log('\nFull card:', JSON.stringify(card, null, 2));

  // Send via gateway plugin
  console.log('\n--- Sending test card via plugin ---');
  const result = await invoke('task_card_create', {
    receive_id_type: 'chat_id',
    receive_id: CHAT_ID,
    task: {
      title: '🧪 collapsible_panel 组件更新完成',
      titleTemplate: 'green',
      messages: [
        { text: '✅ buildLogFold → collapsible_panel', level: 'success' },
        { text: '✅ buildFileList → collapsible_panel', level: 'success' },
        { text: '✅ buildCollapsiblePanel → 官方 JSON 2.0 格式', level: 'success' },
        { text: '✅ 标准_icon + down-small-ccm_outlined', level: 'success' },
        { text: '✅ border + corner_radius 样式', level: 'success' },
        { text: '⚠️ 需飞书客户端 7.20+ 才能渲染 JSON 2.0', level: 'warn' },
        { text: '💡 main plugin (V1) 暂不涉及，仍用 div fallback', level: 'info' }
      ]
    }
  });
  console.log('Plugin card result:', JSON.stringify(result, null, 2));
}

main().catch(console.error);
