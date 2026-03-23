import { getTask, updateTask } from '../services/task-manager.js';
import { buildTaskCard, buildCompleteMarker } from '../services/card-builder.js';

export async function handleTaskComplete(api, event) {
  try {
    const { taskId, summary, results } = event;
    
    const taskState = getTask(taskId);
    if (!taskState) {
      api.logger.debug(`[feishu-card-enhanced] 未找到任务状态：${taskId}`);
      return;
    }
    
    api.logger.info(`[feishu-card-enhanced] 任务完成：${taskState.title}`);
    
    // 更新状态
    updateTask(taskId, {
      progress: 100,
      summary: summary || taskState.summary
    });
    
    // 处理结果中的文件
    if (results && results.files) {
      const state = getTask(taskId);
      state.fileResults = results.files.map(f => ({
        name: f.name,
        share_url: f.share_url
      }));
    }
    
    // 更新卡片
    const updatedState = getTask(taskId);
    if (updatedState.messageId) {
      const cardContent = buildTaskCard(updatedState);
      
      // 添加完成标记
      cardContent.elements.push(buildCompleteMarker());
      
      await api.callTool('message', {
        action: 'update',
        channel: 'feishu',
        target: updatedState.receiveId,
        message_id: updatedState.messageId,
        card: cardContent
      });
      
      api.logger.info(`[feishu-card-enhanced] 任务完成卡片已更新：${updatedState.messageId}`);
    }
    
  } catch (error) {
    api.logger.error('[feishu-card-enhanced] Hook task_complete 失败:', error);
  }
}
