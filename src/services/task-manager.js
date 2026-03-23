/**
 * 任务状态管理器
 * 管理任务的生命周期和状态
 */

// 内存存储（重启后丢失）
const taskStates = new Map();

/**
 * 生成唯一任务 ID
 */
function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 创建任务状态
 */
function createTask(taskId, title, steps, channel, receiveIdType, receiveId) {
  const state = {
    taskId,
    title,
    steps,
    currentStepIndex: 0,
    currentStep: steps[0] || '',
    progress: 0,
    logs: [],
    fileResults: [],
    summary: null,
    createdAt: new Date().toISOString(),
    channel,
    receiveIdType,
    receiveId,
    messageId: null
  };
  
  taskStates.set(taskId, state);
  return state;
}

/**
 * 获取任务状态
 */
function getTask(taskId) {
  return taskStates.get(taskId);
}

/**
 * 更新任务状态
 */
function updateTask(taskId, updates) {
  const state = taskStates.get(taskId);
  if (!state) {
    return null;
  }
  
  Object.assign(state, updates);
  taskStates.set(taskId, state);
  return state;
}

/**
 * 添加日志
 */
function addLog(taskId, message, type = 'info') {
  const state = taskStates.get(taskId);
  if (!state) {
    return false;
  }
  
  const timestamp = new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const prefix = {
    'success': '✅',
    'error': '❌',
    'info': 'ℹ️'
  }[type] || 'ℹ️';
  
  state.logs.push(`[${timestamp}] ${prefix} ${message}`);
  return true;
}

/**
 * 计算进度百分比
 */
function calculateProgress(currentStepIndex, totalSteps, isCompleted) {
  if (totalSteps === 0) return 0;
  const completed = isCompleted ? currentStepIndex + 1 : currentStepIndex;
  return Math.round((completed / totalSteps) * 100);
}

/**
 * 删除任务状态
 */
function deleteTask(taskId) {
  return taskStates.delete(taskId);
}

/**
 * 列出所有任务
 */
function listTasks() {
  return Array.from(taskStates.values());
}

/**
 * 清理过期任务（可选）
 */
function cleanupTasks(maxAgeHours = 24) {
  const now = Date.now();
  const maxAge = maxAgeHours * 60 * 60 * 1000;
  
  for (const [taskId, state] of taskStates.entries()) {
    const createdAt = new Date(state.createdAt).getTime();
    if (now - createdAt > maxAge) {
      taskStates.delete(taskId);
    }
  }
}

export {
  generateTaskId,
  createTask,
  getTask,
  updateTask,
  addLog,
  calculateProgress,
  deleteTask,
  listTasks,
  cleanupTasks
};
