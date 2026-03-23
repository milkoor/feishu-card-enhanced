function buildTestCardResponse(action, status) {
  const templates = {
    doing: { color: "yellow", label: "🛠️ 进行中" },
    done: { color: "green", label: "✅ 已完成" },
    error: { color: "red", label: "❌ 失败" }
  };
  
  const t = templates[status] || templates.doing;
  
  const stepStatus = status === "done" 
    ? "- [x] 步骤 1: 初始化 ✅\n- [x] 步骤 2: 执行中 ✅\n- [x] 步骤 3: 完成 ✅"
    : "- [x] 步骤 1: 初始化 ✅\n- [ ] 步骤 2: 执行中\n- [ ] 步骤 3: 完成";
  
  const footer = status === "done" ? "*所有任务已完成！*" : `*已更新为"${t.label}"状态*`;
  
  const nextAction = status === "done" ? null : {
    tag: "action",
    actions: [
      {
        tag: "button",
        text: { tag: "plain_text", content: "✅ 更新为已完成" },
        type: "primary",
        value: JSON.stringify({ action: "update_to_done" })
      }
    ]
  };
  
  return {
    card: {
      type: "raw",
      data: {
        config: { wide_screen_mode: true },
        header: {
          template: t.color,
          title: {
            tag: "plain_text",
            content: `🧪 测试 2.1 - 卡片更新演示 ${t.label}`
          }
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**当前状态**: ${t.label}\n\n**子任务进度**:\n${stepStatus}\n\n---\n${footer}`
            }
          },
          ...(nextAction ? [nextAction] : [])
        ]
      }
    }
  };
}

function handleTestCallbacks(actionValue) {
  if (actionValue.action === "update_to_doing") {
    return buildTestCardResponse("update_to_doing", "doing");
  }
  if (actionValue.action === "update_to_done") {
    return buildTestCardResponse("update_to_done", "done");
  }
  return null;
}

export { handleTestCallbacks, buildTestCardResponse };
