import { createTask, generateTaskId, updateTask, getTask } from '../services/task-manager.js';
import { buildTaskCard } from '../services/card-builder.js';

export async function handleTaskStart(api, event) {
  try {
    const { taskId, taskName, steps, channel } = event;
    
    // 只在飞书渠道自动创建
    if (channel !== 'feishu') {
      api.logger.debug(`[feishu-card-enhanced] 跳过非飞书渠道：${channel}`);
      return;
    }
    
    // 只在多步骤任务时创建（步骤数 > 1）
    if (!steps || steps.length <= 1) {
      api.logger.debug(`[feishu-card-enhanced] 跳过单步骤任务：${taskName}`);
      return;
    }
    
    api.logger.info(`[feishu-card-enhanced] 检测到多步骤任务：${taskName}, 步骤数：${steps.length}`);
    
    // 创建任务状态
    const taskState = createTask(
      taskId || generateTaskId(),
      taskName,
      steps,
      channel,
      'chat_id',
      channel
    );
    
    // 构建初始卡片
    const cardContent = buildTaskCard(taskState);
    
    // 发送卡片到飞书
    const result = await api.callTool('message', {
      action: 'send',
      channel: 'feishu',
      target: taskState.receiveId,
      message: '',
      card: cardContent
    });
    
    // 保存消息 ID
    updateTask(taskState.taskId, {
      messageId: result.message_id,
      receiveIdType: result.receive_id_type || 'chat_id',
      receiveId: result.receive_id || channel
    });
    
    api.logger.info(`[feishu-card-enhanced] 任务卡片创建成功：${taskState.taskId}, 消息 ID: ${result.message_id}`);
    
  } catch (error) {
    api.logger.error('[feishu-card-enhanced] Hook task_start 失败:', error);
  }
}
