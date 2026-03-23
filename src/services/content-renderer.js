import { parseLLMContent } from './content-parser.js';

const MAX_CONTENT_LEN = 1800;

const EMOJI_MAP = {
  ':smile:': '😊', ':laugh:': '😄', ':heart:': '❤️', ':thumbsup:': '👍',
  ':thumbsdown:': '👎', ':star:': '⭐', ':fire:': '🔥', ':rocket:': '🚀',
  ':warning:': '⚠️', ':check:': '✅', ':cross:': '❌', ':question:': '❓',
  ':bulb:': '💡', ':gear:': '⚙️', ':clock:': '⏰', ':hourglass:': '⏳'
};

function expandEmojis(text) {
  if (!text) return text;
  return text.replace(/:([a-z]+):/g, (match, name) => EMOJI_MAP[match] || match);
}

function convertLinks(text) {
  if (!text) return text;
  return text.replace(/(https?:\/\/[^\s\)）\]]+)/g, '[$1]($1)');
}

function processTextContent(text) {
  if (!text) return '';
  text = expandEmojis(text);
  text = convertLinks(text);
  return text;
}

export function renderContentElements(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map(element => renderElement(element)).filter(Boolean);
}

function renderElement(element) {
  if (!element || !element.type) return null;
  switch (element.type) {
    case 'heading': return renderHeading(element.data);
    case 'table':   return renderTable(element.data);
    case 'code':    return renderCode(element.data);
    case 'image':   return renderImage(element.data);
    case 'list':    return renderList(element.data);
    case 'text':    return renderText(element.data);
    case 'divider': return renderDivider();
    default:        return null;
  }
}

function trunc(content) {
  if (!content || content.length <= MAX_CONTENT_LEN) return content;
  return content.substring(0, MAX_CONTENT_LEN) + '\n… _(内容过长已截断)_';
}

function renderHeading(data) {
  return { tag: 'markdown', content: `**${trunc(data?.text || '')}**` };
}

function renderTable(data) {
  const { columns = [], rows = [] } = data;
  if (columns.length === 0) return null;
  const MAX_ROWS = 50;
  const limitedRows = rows.slice(0, MAX_ROWS);
  const truncated = rows.length > MAX_ROWS;
  return {
    tag: 'table',
    columns: columns.map(col => ({
      name: String(col.name || col),
      width: colWidth(String(col.name || col), limitedRows),
    })),
    rows: [
      ...limitedRows.map(row => {
        const rowData = {};
        columns.forEach(col => {
          const name = String(col.name || col);
          rowData[name] = trunc(String(row[name] || ''));
        });
        return rowData;
      }),
      ...(truncated ? [Object.fromEntries(columns.map(c => [String(c.name || c), '… _(更多行)_']))] : [])
    ]
  };
}

function colWidth(colName, rows) {
  const vals = [colName, ...rows.map(r => String(r[colName] || ''))];
  const maxLen = Math.max(...vals.map(v => v.length));
  if (maxLen <= 6) return '60px';
  if (maxLen <= 12) return '100px';
  if (maxLen <= 20) return '160px';
  return '200px';
}

function renderCode(data) {
  const { language = 'text', content = '' } = data;
  const langBadge = language && language !== 'text' ? `\`${language}\`\n` : '';
  const hint = content.length > 20 ? '\n_📋 可复制_' : '';
  return { tag: 'markdown', content: `${langBadge}\`\`\`${language}\n${trunc(content)}\n\`\`\`${hint}` };
}

function renderImage(data) {
  const { alt = '', url = '' } = data;
  if (!url) return null;
  const label = alt || url.split('/').pop() || '图片';
  return { tag: 'markdown', content: `[${label}](${url})` };
}

function renderList(data) {
  const { ordered = false, items = [] } = data;
  if (items.length === 0) return null;
  const MAX_ITEMS = 100;
  const limited = items.slice(0, MAX_ITEMS);
  const truncated = items.length > MAX_ITEMS;
  const content = [
    ...limited.map((item, i) => `${ordered ? i + 1 + '.' : '-'} ${item}`),
    ...(truncated ? ['… _(更多项)_'] : [])
  ].join('\n');
  return { tag: 'markdown', content };
}

function renderText(data) {
  const { content = '' } = data;
  if (!String(content).trim()) return null;
  return { tag: 'markdown', content: trunc(processTextContent(String(content))) };
}

function renderDivider() {
  return { tag: 'hr' };
}

export function renderMarkdown(content) {
  if (content == null || content === undefined) return [];
  if (typeof content !== 'string') return [];
  const elements = parseLLMContent(String(content));
  return renderContentElements(elements);
}

export default { renderContentElements, renderMarkdown };

