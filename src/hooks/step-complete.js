import { getTask, addLog, updateTask, calculateProgress } from '../services/task-manager.js';
import { buildTaskCard } from '../services/card-builder.js';

export async function handleStepComplete(api, event) {
  try {
    const { taskId, stepName, result, status } = event;
    
    const taskState = getTask(taskId);
    if (!taskState) {
      api.logger.debug(`[feishu-card-enhanced] 未找到任务状态：${taskId}`);
      return;
    }
    
    api.logger.info(`[feishu-card-enhanced] 步骤完成：${stepName}`);
    
    // 添加日志
    addLog(taskId, `${stepName}: ${result || '步骤已完成'}`, 'success');
    
    // 更新步骤索引
    const stepIndex = taskState.steps.indexOf(stepName);
    if (stepIndex >= 0) {
      const nextIndex = stepIndex + 1;
      const nextStep = taskState.steps[nextIndex] || stepName;
      const progress = calculateProgress(nextIndex, taskState.steps.length, true);
      
      updateTask(taskId, {
        currentStepIndex: nextIndex,
        currentStep: nextStep,
        progress
      });
    }
    
    // 更新卡片
    const updatedState = getTask(taskId);
    if (updatedState.messageId) {
      const cardContent = buildTaskCard(updatedState);
      
      await api.callTool('message', {
        action: 'update',
        channel: 'feishu',
        target: updatedState.receiveId,
        message_id: updatedState.messageId,
        card: cardContent
      });
      
      api.logger.info(`[feishu-card-enhanced] 卡片已更新：${updatedState.messageId}`);
    }
    
  } catch (error) {
    api.logger.error('[feishu-card-enhanced] Hook step_complete 失败:', error);
  }
}
