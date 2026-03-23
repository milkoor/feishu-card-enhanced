/**
 * 日志折叠组件
 * 使用官方 collapsible_panel (JSON 2.0) 格式。
 * @param {string[]} logs - 日志数组
 * @param {boolean} folded - 是否默认折叠
 */
export function buildLogFold(logs, folded = false) {
  if (!logs || logs.length === 0) {
    return null;
  }

  const logContent = logs.map(log => `• ${log}`).join('\n');

  return {
    tag: 'collapsible_panel',
    expanded: folded !== true, // !folded means collapsed by default
    header: {
      title: {
        tag: 'plain_text',
        content: `执行日志 (${logs.length}条)`
      },
      vertical_align: 'center',
      icon: {
        tag: 'standard_icon',
        token: 'down-small-ccm_outlined',
        size: '16px 16px'
      },
      icon_position: 'right',
      icon_expanded_angle: -180
    },
    border: {
      color: 'grey',
      corner_radius: '5px'
    },
    vertical_spacing: '8px',
    padding: '8px 8px 8px 8px',
    elements: [
      {
        tag: 'markdown',
        content: logContent
      }
    ]
  };
}

export default {
  buildLogFold
};
