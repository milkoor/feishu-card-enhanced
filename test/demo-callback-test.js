// 处理测试按钮
if (actionValue.action === "test_1_2_success") {
  console.log("[feishu-card] 测试按钮点击：test_1_2_success, context:", JSON.stringify(context));
  // 从 callbackData 或 context 获取用户 ID
  const targetId = callbackData?.user_id || context?.user_id || context?.userId;
  if (targetId) {
    try {
      await api.message.send({
        to: `user:${targetId}`,
        message: "🎉 **测试 1.2 成功！**\n\n按钮回调逻辑已验证，双向通信链路正常！✅"
      });
      console.log("[feishu-card] 自动回复发送成功");
    } catch (e) {
      console.error("[feishu-card] 自动回复失败:", e.message);
    }
  } else {
    console.warn("[feishu-card] 找不到目标用户 ID，无法发送自动回复");
  }
  return { type: "none" };
} else if (actionValue.action === "test_1_2_fail") {
  console.log("[feishu-card] 测试按钮点击：test_1_2_fail");
  const targetId = callbackData?.user_id || context?.user_id || context?.userId;
  if (targetId) {
    try {
      await api.message.send({
        to: `user:${targetId}`,
        message: "❌ **测试 1.2 失败**\n\n请反馈具体问题，我会修复！"
      });
    } catch (e) {
      console.error("[feishu-card] 自动回复失败:", e.message);
    }
  }
  return { type: "none" };
}
