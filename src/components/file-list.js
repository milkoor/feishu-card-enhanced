/**
 * 文件列表组件
 * 使用官方 collapsible_panel (JSON 2.0) 格式。
 * @param {Object[]} files - 文件对象数组
 * @param {string} files[].name - 文件名
 * @param {string} files[].share_url - 文件分享链接
 */
export function buildFileList(files) {
  if (!files || files.length === 0) {
    return null;
  }

  const fileElements = files.map(f => ({
    tag: 'markdown',
    content: `📎 [${f.name}](${f.share_url || 'javascript:void(0)'})`
  }));

  return {
    tag: 'collapsible_panel',
    expanded: false,
    header: {
      title: {
        tag: 'plain_text',
        content: `成果文件 (${files.length}个)`
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
    elements: fileElements.length > 0 ? fileElements : [{ tag: 'markdown', content: '暂无文件' }]
  };
}

export default {
  buildFileList
};
