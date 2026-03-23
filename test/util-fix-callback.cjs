const fs = require('fs');
const content = fs.readFileSync('index.js', 'utf8');

// 检查是否已存在回调注册
if (content.includes('registerCardActionCallback')) {
  console.log('✅ 回调已存在');
} else {
  // 在 import 后添加回调注册
  const importLine = 'import { registerCardActionCallback } from "../../extensions/feishu-openclaw-plugin/src/tools/auto-auth.js";';
  if (!content.includes(importLine)) {
    const newImport = importLine + '\n';
    fs.writeFileSync('index.js', newImport + content);
    console.log('✅ 已添加 import');
  }
  
  // 在 export default function(api) 中添加注册逻辑
  const content2 = fs.readFileSync('index.js', 'utf8');
  const oldFunc = 'export default function (api) {\n  // 加载持久化状态\n  const state = loadState();\n  console.log("[feishu-card] 插件初始化，加载任务数:", Object.keys(state).length);';
  
  const newFunc = `export default function (api) {
  // 加载持久化状态
  const state = loadState();
  console.log("[feishu-card] 插件初始化，加载任务数:", Object.keys(state).length);
  
  // 注册通用卡片回调处理器
  try {
    const { registerCardActionCallback } = await import("../../extensions/feishu-openclaw-plugin/src/tools/auto-auth.js");
    
    registerCardActionCallback("update_to_doing", async (actionValue, context) => {
      console.log("[feishu-card] 收到通用回调：update_to_doing", actionValue);
      return await api.invoke("task_card_update", {
        task_id: actionValue.task_id || "test_task",
        status: "doing",
        title: "🧪 测试 - 进行中"
      });
    });
    
    registerCardActionCallback("update_to_done", async (actionValue, context) => {
      console.log("[feishu-card] 收到通用回调：update_to_done", actionValue);
      return await api.invoke("task_card_update", {
        task_id: actionValue.task_id || "test_task",
        status: "done",
        title: "🧪 测试 - 已完成"
      });
    });
    
    console.log("[feishu-card] 通用卡片回调已注册");
  } catch (err) {
    console.warn("[feishu-card] 无法注册通用卡片回调:", err.message);
  }`;
  
  if (content2.includes(oldFunc)) {
    fs.writeFileSync('index.js', content2.replace(oldFunc, newFunc));
    console.log('✅ 已添加回调注册逻辑');
  } else {
    console.log('⚠️ 未找到目标代码');
  }
}
