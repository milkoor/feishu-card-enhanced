/**
 * 飞书卡片增强插件 - 核心入口
 * 
 * 功能：
 * - 创建/更新/删除任务卡片
 * - 状态持久化 (state.json)
 * - 交互式按钮回调处理
 * 
 * @author 杨博
 * @version 1.1.0
 * @since 2026-03-21
 */

import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { withRetry, isRetryableFeishuError } from "./src/utils/retry.js";
import { renderMarkdown } from "./src/services/content-renderer.js";

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== 状态管理 ====================

const STATE_FILE = join(__dirname, "state.json");

/**
 * 加载持久化状态
 */
function loadState() {
  try {
    if (existsSync(STATE_FILE)) {
      const data = readFileSync(STATE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("[feishu-card] 状态文件加载失败，将创建新状态:", e.message);
  }
  return {};
}

/**
 * 保存状态到文件
 */
function saveState(state) {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("[feishu-card] 状态保存失败:", e.message);
    return false;
  }
}

/**
 * 获取当前时间 ISO 格式
 */
function nowISO() {
  return new Date().toISOString();
}

/**
 * 安全解析 JSON
 */
function safeJSON(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * 参数校验和自动修复 - 解决模型传参格式错误问题
 * 模型可能将数组/对象误传为 JSON 字符串，此函数自动修复
 */
function validateParams(params) {
  const errors = [];
  const fixed = { ...params };
  const schema = {
    task_id: { type: "string", required: true },
    title: { type: "string" },
    titleTemplate: { type: "string" },
    status: { type: "string" },
    subtasks: { type: "array" },
    messages: { type: "array" },
    actions: { type: "array" },
    lastError: { type: "string" },
    lang: { type: "string" }
  };
  
  for (const [key, value] of Object.entries(schema)) {
    if (value.required && (value === undefined || value === null)) {
      errors.push(`Missing required: ${key}`);
      continue;
    }
    
    if (params[key] === undefined) {
      continue;
    }
    
    if (value.type === "array" && typeof params[key] === "string") {
      try {
        const parsed = JSON.parse(params[key]);
        if (Array.isArray(parsed)) {
          fixed[key] = parsed;
        } else {
          errors.push(`${key}: not a valid array`);
        }
      } catch {
        errors.push(`${key}: invalid JSON string, expected array`);
      }
    }
    
    if (value.type === "object" && typeof params[key] === "string") {
      try {
        fixed[key] = JSON.parse(params[key]);
      } catch {
        errors.push(`${key}: invalid JSON string, expected object`);
      }
    }
  }
  
  return { errors, fixed };
}

// ==================== API 凭证获取 ====================

/**
 * 获取飞书凭证
 */
function getFeishuCreds(api) {
  const appId = api.config.channels?.feishu?.appId;
  const appSecret = api.config.channels?.feishu?.appSecret;
  
  if (!appId || !appSecret) {
    throw new Error("Missing feishu appId/appSecret config");
  }
  
  return { appId, appSecret };
}

/**
 * 获取 tenant_access_token
 */
async function getTenantAccessToken(api) {
  const { appId, appSecret } = getFeishuCreds(api);
  
  const response = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret })
    }
  );
  
  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`获取 token 失败：${data.msg}`);
  }
  
  return data.tenant_access_token;
}

// ==================== 卡片渲染函数 ====================

/**
 * 渲染子任务列表
 */
function renderSubtasks(subtasks = [], lang = "zh") {
  if (!subtasks || subtasks.length === 0) {
    return null;
  }
  
  const statusMap = {
    todo: { icon: "⏳", text: { zh: "待开始", en: "Pending" } },
    doing: { icon: "🔄", text: { zh: "进行中", en: "In Progress" } },
    done: { icon: "✅", text: { zh: "已完成", en: "Completed" } },
    error: { icon: "❌", text: { zh: "失败", en: "Failed" } }
  };
  
  const lines = subtasks.map((task) => {
    const status = statusMap[task.status] || statusMap.todo;
    const statusText = status.text[lang] || status.text.zh;
    return `${status.icon} **${task.label}** - ${statusText}${task.detail ? `\n└ ${task.detail}` : ""}`;
  });
  
  return {
    tag: "div",
    text: {
      tag: "lark_md",
      content: lines.join("\n")
    }
  };
}

/**
 * 渲染消息流 - 单个可折叠面板
 * 标题显示最新消息，展开后用 renderMarkdown 解析每条消息的结构化内容
 * @returns {Object|null} collapsible_panel 元素，或 null
 */
function renderMessages(messages = [], lang = "zh") {
  if (!messages || messages.length === 0) {
    return null;
  }
  
  const levelConfig = {
    info:    { icon: "ℹ️",  borderColor: "blue"  },
    warn:    { icon: "⚠️",  borderColor: "yellow" },
    error:   { icon: "❌",  borderColor: "red"   },
    success: { icon: "✅",  borderColor: "green"  },
  };

  function relativeTime(isoStr) {
    if (!isoStr) return null;
    try {
      const diff = Date.now() - new Date(isoStr).getTime();
      const secs = Math.floor(diff / 1000);
      if (secs < 60) return secs <= 5 ? null : (lang === 'zh' ? `${secs}秒前` : `${secs}s ago`);
      const mins = Math.floor(secs / 60);
      if (mins < 60) return lang === 'zh' ? `${mins}分钟前` : `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return lang === 'zh' ? `${hrs}小时前` : `${hrs}h ago`;
      return null;
    } catch { return null; }
  }

  function stripMd(text) {
    return (text || '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ''))
      .replace(/\|[^\n]+\|/g, (row) => row.replace(/\|/g, ' ').trim())
      .replace(/-+/g, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  const validMessages = messages.filter(m => m && (m.text || m.level));
  
  validMessages.sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : 0;
    const timeB = b.time ? new Date(b.time).getTime() : 0;
    if (timeA && timeB) return timeA - timeB;
    if (timeA) return 1;
    if (timeB) return -1;
    return 0;
  });
  
  if (validMessages.length === 0) {
    return null;
  }

  const latest = validMessages[validMessages.length - 1];
  const latestLevel = levelConfig[latest.level] || levelConfig.info;
  const latestText = String(latest?.text || (lang === 'zh' ? '[空消息]' : '[empty]'));

  const cleanTitle = stripMd(latestText);
  const endsComplete = /[.。!！?？)）\]:」\n]$/.test(cleanTitle.trim());
  const latestTitle = cleanTitle.length > 40
    ? cleanTitle.substring(0, 40) + '…'
    : (endsComplete ? cleanTitle : cleanTitle + '…');

  const relTime = relativeTime(latest.time);
  const absTime = latest.time
    ? (() => { try { return new Date(latest.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Shanghai' }); } catch { return ''; } })()
    : '';
  const headerTime = relTime || absTime;
  const headerTitle = headerTime
    ? `${latestLevel.icon} ${latestTitle} (${headerTime})`
    : `${latestLevel.icon} ${latestTitle}`;

  const parsedElements = [];
  let prevText = null;
  let uniqueCount = 0;
  let hasError = false;
  let firstErrorText = '';

  validMessages.forEach((msg, i) => {
    const msgTextStr = String(msg?.text || '');
    if (msgTextStr && msgTextStr === prevText) return;
    prevText = msgTextStr;
    uniqueCount++;

    const cfg = levelConfig[msg?.level || 'info'];
    const isLatest = i === validMessages.length - 1;

    if (msg?.level === 'error' && !hasError) {
      hasError = true;
      firstErrorText = stripMd(msgTextStr) || (lang === 'zh' ? '发生错误' : 'Error occurred');
    }

    if (msg?.level && msg?.level !== 'info') {
      parsedElements.push({ tag: "markdown", content: `${cfg.icon} **${msg.level.toUpperCase()}**` });
    }

    const contentComponents = renderMarkdown(msgTextStr);
    if (contentComponents && contentComponents.length > 0) {
      parsedElements.push(...contentComponents);
    } else if (msgTextStr.trim()) {
      parsedElements.push({ tag: "markdown", content: msgTextStr });
    } else {
      parsedElements.push({ tag: "markdown", content: `_${lang === 'zh' ? '无内容' : '(empty)'}_` });
    }

    if (isLatest) {
      const isStreaming = !/[.。!！?？)）\]:」\n]$/.test(msgTextStr.trim());
      const streamHint = isStreaming ? ' ⏳' : '';
      parsedElements.push({ tag: "markdown", content: "▸ *" + (lang === 'zh' ? '最新回复' : 'Latest') + `*${streamHint}` });
    }

    if (!isLatest) {
      parsedElements.push({ tag: "hr" });
    }
  });

  const totalMsgs = validMessages.length;
  const uniqueMsgs = uniqueCount;
  const countHint = totalMsgs !== uniqueMsgs
    ? (lang === 'zh' ? ` (${uniqueMsgs}条不重复)` : ` (${uniqueMsgs} unique)`)
    : '';
  const expandHint = totalMsgs > 1
    ? (lang === 'zh' ? ' — 点击展开' : ' — tap to expand')
    : '';

  const shouldExpand = totalMsgs === 1 || parsedElements.length < 5;

  return {
    tag: "collapsible_panel",
    expanded: shouldExpand,
    header: {
      title: {
        tag: "plain_text",
        content: `${totalMsgs}${lang === 'zh' ? '条消息' : ' msgs'}${countHint} | ${headerTitle}${expandHint}`
      },
      vertical_align: "center",
      icon: {
        tag: "standard_icon",
        token: "down-small-ccm_outlined",
        size: "16px 16px"
      },
      icon_position: "right",
      icon_expanded_angle: -180
    },
    border: {
      color: latestLevel.borderColor,
      corner_radius: "5px"
    },
    vertical_spacing: "4px",
    padding: "6px 8px 6px 8px",
    elements: parsedElements
  };
}

function inferTaskStatus(messages) {
  if (!messages || messages.length === 0) return null;
  for (const msg of messages) {
    if (msg.level === 'error') return 'error';
  }
  for (const msg of messages) {
    if (msg.level === 'warn') return 'doing';
  }
  const hasText = messages.some(m => m.text && m.level !== 'error');
  return hasText ? 'doing' : null;
}

/**
 * 构建卡片内容
 */
function buildCardContent(task, lang = "zh") {
  const elements = [];
  
  const doneCount = (task.subtasks || []).filter((s) => s.status === "done").length;
  const totalCount = (task.subtasks || []).length;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  elements.push({
    tag: "div",
    text: {
      tag: "lark_md",
      content: `📊 **${lang === "zh" ? "进度" : "Progress"}:** \`${progress}%\` (${doneCount}/${totalCount})`
    }
  });
  
  // 子任务
  const subtasksElement = renderSubtasks(task.subtasks, lang);
  if (subtasksElement) {
    elements.push(subtasksElement);
  }
  
  // 子任务快捷操作按钮
  const subtasks = task.subtasks || [];
  if (subtasks.length > 0 && subtasks.length <= 5) {
    const nextStatusMap = { todo: "doing", doing: "done", done: "todo", error: "todo" };
    const toggleLabelMap = {
      todo: { zh: "开始", en: "Start" },
      doing: { zh: "完成", en: "Done" },
      done: { zh: "重置", en: "Reset" },
      error: { zh: "重试", en: "Retry" }
    };
    const buttons = subtasks.map((s) => ({
      tag: "button",
      text: { tag: "plain_text", content: s.label },
      type: s.status === 'done' ? 'primary' : 'default',
      value: JSON.stringify({ action: 'toggle_subtask', subtask_id: s.id, status: nextStatusMap[s.status] || 'done' })
    }));
    elements.push({ tag: "hr" });
    elements.push({ tag: "action", children: buttons });
  }
  
  // 消息流 - 单个可折叠面板
  const messagePanel = renderMessages(task.messages || [], lang);
  if (messagePanel) {
    elements.push(messagePanel);
  }
  
  // 错误信息 (from task.lastError or inferred from messages)
  const messages = task.messages || [];
  let errorText = task.lastError || '';
  if (!errorText) {
    for (const msg of messages) {
      if (msg.level === 'error' && msg.text) {
        const stripped = String(msg.text).replace(/#{1,6}\s+/g, '').replace(/\n+/g, ' ').trim();
        errorText = stripped.length > 120 ? stripped.substring(0, 120) + '…' : stripped;
        break;
      }
    }
  }
  if (errorText) {
    const errMsg = lang === 'zh' ? `❌ **错误:** ${errorText}` : `❌ **Error:** ${errorText}`;
    elements.push({
      tag: "div",
      text: { tag: "lark_md", content: errMsg }
    });
  }
  
  // 操作按钮
  const defaultActions = [
    { text: lang === "zh" ? "重试" : "Retry", action: "retry", type: "primary" },
    { text: lang === "zh" ? "继续" : "Continue", action: "continue", type: "default" }
  ];
  
  const actions = task.actions || defaultActions;
  if (actions.length > 0) {
    elements.push({
      tag: "hr"
    });
    elements.push({
      tag: "action",
      children: actions.map((action) => ({
        tag: "button",
        text: {
          tag: "plain_text",
          content: action.text
        },
        type: action.type === "primary" ? "primary" : "default",
        value: JSON.stringify({
          action: action.action,
          task_id: task.task_id,
          ...(action.payload || {})
        })
      }))
    });
  }
  
  const statusColorMap = { error: "red", done: "green", success: "green", doing: "blue", warn: "yellow" };
  const headerColor = task.titleTemplate || statusColorMap[task.status] || "blue";

  const allMsgText = (task.messages || []).map(m => `${m.level || 'info'}: ${m.text || ''}`).join('\n---\n');
  if (allMsgText) {
    elements.push({ tag: "hr" });
    elements.push({
      tag: "action",
      children: [{
        tag: "button",
        text: { tag: "plain_text", content: lang === 'zh' ? '📋 复制全部消息' : '📋 Copy All' },
        type: "default",
        value: JSON.stringify({ action: 'copy_messages', text: allMsgText })
      }]
    });
  }

  return {
    config: {
      wide_screen_mode: true
    },
    header: {
      template: headerColor,
      title: {
        tag: "plain_text",
        content: task.title
      }
    },
    elements
  };
}

// ==================== API 调用函数 ====================

async function sendCard(api, token, cardContent, receiveId, receiveIdType) {
  const url = `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=${receiveIdType}`;
  
  return withRetry(async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        receive_id: receiveId,
        msg_type: "interactive",
        content: JSON.stringify(cardContent)
      })
    });
    
    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(`发送卡片失败：${result.msg} (code: ${result.code})`);
    }
    
    return {
      message_id: result.data.message_id,
      receive_id: receiveId,
      receive_id_type: receiveIdType
    };
  }, {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 1.5,
    retryableErrors: isRetryableFeishuError
  });
}

async function updateCard(api, token, messageId, cardContent) {
  const url = `https://open.feishu.cn/open-apis/im/v1/messages/${messageId}`;
  
  return withRetry(async () => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        content: JSON.stringify(cardContent)
      })
    });
    
    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(`更新卡片失败：${result.msg} (code: ${result.code})`);
    }
    
    return true;
  }, {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 1.5,
    retryableErrors: isRetryableFeishuError
  });
}

async function deleteMessage(api, token, messageId) {
  const url = `https://open.feishu.cn/open-apis/im/v1/messages/${messageId}`;
  
  return withRetry(async () => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    
    const result = await response.json();
    if (result.code !== 0) {
      throw new Error(`删除消息失败：${result.msg} (code: ${result.code})`);
    }
    
    return true;
  }, {
    maxRetries: 3,
    baseDelay: 1000,
    backoffMultiplier: 1.5,
    retryableErrors: isRetryableFeishuError
  });
}

// ==================== 插件主函数 ====================

export default function (api) {
  // 加载持久化状态
  const state = loadState();
  
  console.log("[feishu-card] 插件初始化，加载任务数:", Object.keys(state).length);
  
  console.log("[feishu-card] ✅ Registered 7 tools: task_card_create, task_card_update, task_card_append, task_card_refresh_bottom, task_card_get, task_card_delete, task_card_health");
  
  // ==================== Tool Registration ====================
  
  /**
   * task_card_create - 创建任务卡片
   */
  api.registerTool({
    name: "task_card_create",
    description: "创建一个新的任务卡片，用于展示分步任务和对话流",
    parameters: {
      receive_id_type: { type: "string", enum: ["open_id", "user_id", "email", "chat_id"] },
      receive_id: { type: "string" },
      task: {
        task_id: { type: "string" },
        title: { type: "string" },
        titleTemplate: { type: "string", enum: ["blue", "green", "red", "yellow", "orange", "purple", "grey"] },
        lang: { type: "string", enum: ["zh", "en"] },
        status: { type: "string", enum: ["todo", "doing", "done", "error"] },
        subtasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              status: { type: "string" },
              detail: { type: "string" }
            }
          }
        },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              level: { type: "string" },
              time: { type: "string" }
            }
          }
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              action: { type: "string" },
              type: { type: "string" },
              payload: { type: "object" }
            }
          }
        }
      }
    },
    async execute(_toolCallId, params) {
      // 参数校验和自动修复 - task/subtasks/messages 等参数可能是 JSON 字符串
      let { receive_id_type, receive_id, task } = params;
      
      // 检查必要参数
      if (!task) {
        return { success: false, error: "Missing required parameter: task" };
      }
      
      // 自动修复 task 对象
      if (typeof task === "string") {
        try {
          task = JSON.parse(task);
        } catch (e) {
          return { success: false, error: `Invalid task JSON string: ${e.message}` };
        }
      }
      
      // 确保 task 是对象
      if (typeof task !== "object" || task === null) {
        return { success: false, error: "task parameter must be an object" };
      }
      
      // 自动修复 subtasks 数组
      if (task && typeof task.subtasks === "string") {
        try {
          task.subtasks = JSON.parse(task.subtasks);
        } catch (e) {
          console.warn("[feishu-card] subtasks parse warning:", e.message);
        }
      }
      
      // 自动修复 messages 数组
      if (task && typeof task.messages === "string") {
        try {
          task.messages = JSON.parse(task.messages);
        } catch (e) {
          console.warn("[feishu-card] messages parse warning:", e.message);
        }
      }
      
      // 自动修复 actions 数组
      if (task && typeof task.actions === "string") {
        try {
          task.actions = JSON.parse(task.actions);
        } catch (e) {
          console.warn("[feishu-card] actions parse warning:", e.message);
        }
      }
      
      try {
        // 获取 token
        const token = await getTenantAccessToken(api);
        
        // 生成任务 ID
        const taskId = task.task_id || `task_${randomUUID()}`;
        const lang = task.lang || "zh";
        
        // 构建卡片内容
        const cardContent = buildCardContent({ ...task, task_id: taskId }, lang);
        
        // 发送卡片
        const result = await sendCard(api, token, cardContent, receive_id, receive_id_type);
        
        // 保存状态
        state[taskId] = {
          card_id: taskId,
          message_id: result.message_id,
          receive_id: receive_id,
          receive_id_type: receive_id_type,
          task: { ...task, task_id: taskId },
          sequence: 1,
          created_at: nowISO()
        };
        saveState(state);
        
        console.log("[feishu-card] 任务卡片创建成功:", taskId, "消息 ID:", result.message_id);
        
        return {
          success: true,
          task_id: taskId,
          message_id: result.message_id
        };
      } catch (e) {
        console.error("[feishu-card] 创建卡片失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
  
  /**
   * task_card_update - 更新任务卡片
   */
  api.registerTool({
    name: "task_card_update",
    description: "更新已有任务卡片的状态、子任务、消息流等。注意：subtasks 和 messages 参数必须是数组对象，不是 JSON 字符串",
    parameters: {
      task_id: { 
        type: "string", 
        description: "任务ID (必需)" 
      },
      title: { 
        type: "string",
        description: "卡片标题" 
      },
      titleTemplate: { 
        type: "string", 
        enum: ["blue", "green", "red", "yellow", "orange", "purple", "grey"],
        description: "标题颜色模板" 
      },
      status: { 
        type: "string", 
        enum: ["todo", "doing", "done", "error"],
        description: "任务状态：todo=待处理, doing=进行中, done=已完成, error=错误" 
      },
      subtasks: {
        type: "array",
        description: "子任务列表，必须是数组对象",
        items: {
          type: "object",
          required: ["id", "label"],
          properties: {
            id: { type: "string", description: "子任务ID" },
            label: { type: "string", description: "子任务名称" },
            status: { 
              type: "string", 
              enum: ["todo", "doing", "done"],
              description: "子任务状态" 
            },
            detail: { type: "string", description: "详细说明" }
          }
        }
      },
      messages: {
        type: "array",
        description: "消息列表，必须是数组对象",
        items: {
          type: "object",
          required: ["text"],
          properties: {
            text: { type: "string", description: "消息内容" },
            level: { 
              type: "string", 
              enum: ["info", "success", "warning", "error"],
              description: "消息级别" 
            },
            time: { type: "string", description: "时间戳" }
          }
        }
      },
      actions: {
        type: "array",
        description: "操作按钮列表",
        items: {
          type: "object",
          properties: {
            text: { type: "string" },
            action: { type: "string" },
            type: { type: "string" },
            payload: { type: "object" }
          }
        }
      },
      lastError: { 
        type: "string",
        description: "最后错误信息" 
      },
      lang: { 
        type: "string",
        enum: ["zh", "en"],
        description: "语言设置" 
      }
    },
    async execute(_toolCallId, params) {
      // 参数校验和自动修复
      const fixedParams = validateParams(params);
      if (fixedParams.errors.length > 0) {
        console.warn("[feishu-card] 参数警告:", fixedParams.errors.join("; "));
      }
      
      const { task_id, title, titleTemplate, status, subtasks, messages, actions, lastError, lang } = fixedParams.fixed;
      
      try {
        const taskState = state[task_id];
        if (!taskState) {
          return { success: false, error: `Task not found: ${task_id}` };
        }
        
        // 获取 token
        const token = await getTenantAccessToken(api);
        
        // 更新任务数据
        const updatedTask = {
          ...taskState.task,
          task_id,
          ...(title !== undefined && { title }),
          ...(titleTemplate !== undefined && { titleTemplate }),
          ...(status !== undefined && { status }),
          ...(subtasks !== undefined && { subtasks }),
          ...(messages !== undefined && { messages }),
          ...(actions !== undefined && { actions }),
          ...(lastError !== undefined && { lastError })
        };
        
        // 构建更新后的卡片内容
        const cardContent = buildCardContent(updatedTask, lang || updatedTask.lang || "zh");
        
        // 更新卡片
        await updateCard(api, token, taskState.message_id, cardContent);
        
        // 保存状态
        taskState.task = updatedTask;
        taskState.updated_at = nowISO();
        taskState.sequence = (taskState.sequence || 1) + 1;
        saveState(state);
        
        console.log("[feishu-card] 任务卡片更新成功:", task_id, "序列:", taskState.sequence);
        
        return { success: true, task_id, sequence: taskState.sequence };
      } catch (e) {
        console.error("[feishu-card] 更新卡片失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
  
  /**
   * task_card_append - 追加子任务或消息
   */
  api.registerTool({
    name: "task_card_append",
    description: "追加子任务或消息到现有卡片",
    parameters: {
      task_id: { type: "string" },
      subtask: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          status: { type: "string" },
          detail: { type: "string" }
        }
      },
      message: {
        type: "object",
        properties: {
          text: { type: "string" },
          level: { type: "string" }
        }
      },
      set_status: { type: "string" }
    },
    async execute(_toolCallId, params) {
      const { task_id, subtask, message, set_status } = params;
      try {
        const taskState = state[task_id];
        if (!taskState) {
          return { success: false, error: `Task not found: ${task_id}` };
        }
        
        // 获取 token
        const token = await getTenantAccessToken(api);
        
        // 更新任务数据
        const updatedTask = { ...taskState.task };
        
        if (subtask) {
          updatedTask.subtasks = [...(updatedTask.subtasks || []), subtask];
        }
        
        if (message) {
          updatedTask.messages = [
            ...(updatedTask.messages || []),
            { ...message, time: nowISO() }
          ];
        }
        
        if (set_status) {
          updatedTask.status = set_status;
        }
        
        // 构建更新后的卡片内容
        const cardContent = buildCardContent(updatedTask, updatedTask.lang || "zh");
        
        // 更新卡片
        await updateCard(api, token, taskState.message_id, cardContent);
        
        taskState.task = updatedTask;
        taskState.updated_at = nowISO();
        taskState.sequence = (taskState.sequence || 1) + 1;
        saveState(state);
        
        console.log("[feishu-card] 任务卡片追加成功:", task_id, "序列:", taskState.sequence);
        
        return { success: true, task_id, sequence: taskState.sequence };
      } catch (e) {
        console.error("[feishu-card] 追加失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
  
  /**
   * task_card_refresh_bottom - 删除旧卡片并重新发送，使其位于对话底部
   */
  api.registerTool({
    name: "task_card_refresh_bottom",
    description: "删除旧卡片并重新发送，保持在对话最下方",
    parameters: {
      task_id: { type: "string" }
    },
    async execute(_toolCallId, params) {
      const { task_id } = params;
      try {
        const taskState = state[task_id];
        if (!taskState) {
          return { success: false, error: `Task not found: ${task_id}` };
        }
        
        // 获取 token
        const token = await getTenantAccessToken(api);
        
        // 删除旧消息
        const oldMessageId = taskState.message_id;
        try {
          await deleteMessage(api, token, oldMessageId);
          console.log("[feishu-card] 旧卡片已删除:", oldMessageId);
        } catch (e) {
          console.warn("[feishu-card] 删除旧卡片失败（可能已不存在）:", e.message);
        }
        
        // 构建卡片内容
        const cardContent = buildCardContent(taskState.task, taskState.task.lang || "zh");
        
        // 发送新卡片
        const result = await sendCard(
          api, 
          token, 
          cardContent, 
          taskState.receive_id, 
          taskState.receive_id_type
        );
        
        taskState.message_id = result.message_id;
        taskState.updated_at = nowISO();
        taskState.sequence = (taskState.sequence || 1) + 1;
        saveState(state);
        
        console.log("[feishu-card] 卡片刷新成功:", task_id, "序列:", taskState.sequence);
        
        return { 
          success: true, 
          task_id,
          sequence: taskState.sequence,
          old_message_id: oldMessageId,
          message_id: result.message_id
        };
      } catch (e) {
        console.error("[feishu-card] 刷新卡片失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
  
  /**
   * task_card_get - 获取任务状态
   */
  api.registerTool({
    name: "task_card_get",
    description: "获取任务当前状态",
    parameters: {
      task_id: { type: "string" }
    },
    async execute(_toolCallId, params) {
      const { task_id } = params;
      const taskState = state[task_id];
      if (!taskState) {
        return { success: false, error: `Task not found: ${task_id}` };
      }
      
      return {
        success: true,
        task: taskState.task,
        message_id: taskState.message_id,
        sequence: taskState.sequence,
        created_at: taskState.created_at,
        updated_at: taskState.updated_at
      };
    }
  });
  
  /**
   * task_card_delete - 删除任务卡片
   */
  api.registerTool({
    name: "task_card_delete",
    description: "删除任务卡片",
    parameters: {
      task_id: { type: "string" }
    },
    async execute(_toolCallId, params) {
      const { task_id } = params;
      try {
        const taskState = state[task_id];
        if (!taskState) {
          return { success: false, error: `Task not found: ${task_id}` };
        }
        
        // 获取 token
        const token = await getTenantAccessToken(api);
        
        // 删除消息
        await deleteMessage(api, token, taskState.message_id);
        
        // 移除状态
        delete state[task_id];
        saveState(state);
        
        console.log("[feishu-card] 任务卡片删除成功:", task_id);
        
        return { success: true, task_id };
      } catch (e) {
        console.error("[feishu-card] 删除失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
  
  /**
   * task_card_health - 健康检查
   */
  api.registerTool({
    name: "task_card_health",
    description: "检查飞书连通性和插件状态",
    parameters: {},
    async execute(_toolCallId, params) {
      try {
        // 1. 检查飞书连通性
        let feishuStatus = "unknown";
        let feishuError = null;
        try {
          const token = await getTenantAccessToken(api);
          feishuStatus = "ok";
        } catch (e) {
          feishuStatus = "error";
          feishuError = e.message;
        }
        
        // 2. 检查状态持久化
        const stateFileExists = existsSync(STATE_FILE);
        const taskCount = Object.keys(state).length;
        
        // 3. 汇总
        const healthy = feishuStatus === "ok";
        console.log("[feishu-card] 健康检查:", healthy ? "✅" : "❌");
        
        return {
          success: healthy,
          feishu: {
            status: feishuStatus,
            error: feishuError
          },
          state: {
            fileExists: stateFileExists,
            activeTasks: taskCount
          },
          checked_at: nowISO()
        };
      } catch (e) {
        console.error("[feishu-card] 健康检查失败:", e.message);
        return { success: false, error: e.message };
      }
    }
  });
}