const fs = require('fs');
let content = fs.readFileSync('index.js', 'utf8');

// 检查是否已有回调注册
if (content.includes('registerCardActionCallback("update_to_doing"')) {
  console.log('✅ 回调已注册');
  process.exit(0);
}

// 在 export default function(api) 后添加回调注册
const oldCode = 'export default function (api) {\n  // 加载持久化状态\n  const state = loadState();\n  console.log("[feishu-card] 插件初始化，加载任务数:", Object.keys(state).length);';

const newCode = `export default function (api) {
  // 加载持久化状态
  const state = loadState();
  console.log("[feishu-card] 插件初始化，加载任务数:", Object.keys(state).length);
  
  // 注册通用卡片回调处理器
  (async () => {
    try {
      const { registerCardActionCallback } = await import("../../extensions/feishu-openclaw-plugin/src/tools/auto-auth.js");
      
      registerCardActionCallback("update_to_doing", async (actionValue, context) => {
        console.log("[feishu-card] 收到通用回调：update_to_doing", JSON.stringify(actionValue));
        return await api.invoke("task_card_update", {
          task_id: actionValue.task_id || "test_task",
          status: "doing",
          title: "🧪 测试 - 进行中"
        });
      });
      
      registerCardActionCallback("update_to_done", async (actionValue, context) => {
        console.log("[feishu-card] 收到通用回调：update_to_done", JSON.stringify(actionValue));
        return await api.invoke("task_card_update", {
          task_id: actionValue.task_id || "test_task",
          status: "done",
          title: "🧪 测试 - 已完成"
        });
      });
      
      console.log("[feishu-card] ✅ 通用卡片回调已注册");
    } catch (err) {
      console.warn("[feishu-card] 无法注册通用卡片回调:", err.message);
    }
  })();`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('index.js', content);
  console.log('✅ 已添加回调注册逻辑');
} else {
  console.log('❌ 未找到目标代码');
}
