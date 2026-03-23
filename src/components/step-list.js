/**
 * 步骤列表组件（多列布局）
 * @param {string[]} steps - 步骤名称数组
 * @param {string} currentStep - 当前步骤
 * @param {number} currentStepIndex - 当前步骤索引
 */
export function buildStepList(steps, currentStep, currentStepIndex = 0) {
  if (!steps || steps.length === 0) {
    return null;
  }
  
  const stepElements = steps.map((step, index) => {
    const isCompleted = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;
    const status = isCompleted ? '✅' : isCurrent ? '🔄' : '⏳';
    const statusText = isCompleted ? '已完成' : isCurrent ? '进行中' : '待开始';
    
    return {
      tag: 'div',
      text: {
        tag: 'lark_md',
        content: `${status} **${step}** - ${statusText}`
      }
    };
  });
  
  return {
    tag: 'column_set',
    columns: [
      {
        tag: 'column',
        width: 'weighted',
        elements: stepElements
      }
    ]
  };
}

export default {
  buildStepList
};
