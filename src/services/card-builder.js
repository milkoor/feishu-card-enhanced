/**
 * 卡片构建器
 * 使用组件库构建完整的任务卡片
 */
import * as components from '../components/index.js';

/**
 * 构建任务卡片
 * @param {Object} taskState - 任务状态对象
 */
function buildTaskCard(taskState) {
  const elements = [];
  
  // 1. 标题
  elements.push(components.buildTitle(taskState.title));
  
  // 2. 进度条
  elements.push(components.buildProgress(taskState.progress));
  
  // 3. 步骤列表
  const stepList = components.buildStepList(
    taskState.steps,
    taskState.currentStep,
    taskState.currentStepIndex
  );
  if (stepList) {
    elements.push(stepList);
  }
  
  // 4. 日志折叠区
  const logFold = components.buildLogFold(taskState.logs);
  if (logFold) {
    elements.push(logFold);
  }
  
  // 5. 文件列表
  const fileList = components.buildFileList(taskState.fileResults);
  if (fileList) {
    elements.push(fileList);
  }
  
  // 6. 总结（如果有）
  if (taskState.summary) {
    elements.push({
      tag: 'markdown',
      content: `**📋 总结：**\n${taskState.summary}`
    });
  }
  
  return {
    title: taskState.title,
    titleTemplate: 'blue',
    elements
  };
}

/**
 * 构建完成标记
 */
function buildCompleteMarker() {
  return {
    tag: 'markdown',
    content: '\n**✅ 任务已全部完成！**'
  };
}

export {
  buildTaskCard,
  buildCompleteMarker
};
