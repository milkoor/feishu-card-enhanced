# Feishu Card Enhanced | 飞书任务卡片增强插件

[English](#english) | [中文](#中文)

---

## English

### Overview

Feishu Card Enhanced is an OpenClaw plugin that provides enhanced Feishu/Lark interactive cards for displaying multi-step task progress and message streams.

### Features

- ✅ **Task Tracking**: Create multi-step tasks with real-time progress
- ✅ **Dynamic Updates**: Update card content in real-time
- ✅ **Message Stream**: Append log messages, record execution process
- ✅ **State Persistence**: Auto-save task state, survive restarts
- ✅ **Error Retry**: Built-in retry mechanism
- ✅ **Interactive Buttons**: Support retry, continue and custom actions
- ✅ **Markdown Rendering**: Tables, code blocks, images, links
- ✅ **Emoji Shortcodes**: `:rocket:` → 🚀 auto-expansion
- ✅ **URL Auto-link**: Convert URLs to clickable links
- ✅ **Time Sorting**: Sort messages by timestamp
- ✅ **Smart Expand**: Auto-expand when content is short

### Installation

#### 1. Install via OpenClaw

```bash
# Copy to extensions directory
cp -r feishu-card-enhanced/ ~/.openclaw/extensions/
```

#### 2. Configure Feishu App

Create an app at [Feishu Open Platform](https://open.feishu.cn/):

- Get `appId` (App ID)
- Get `appSecret` (App Secret)

Add to OpenClaw config:

```json
{
  "channels": {
    "feishu": {
      "appId": "cli_xxxxxxxx",
      "appSecret": "xxxxxxxxxxxxx"
    }
  }
}
```

#### 3. Required Permissions

Ensure your Feishu app has:
- `im:message:send_as_bot` - Send messages
- `im:card:create` - Create interactive cards
- `im:message:update` - Update messages
- `im:message:delete` - Delete messages

### Tools

#### task_card_create

Create a new task card.

```javascript
{
  "name": "task_card_create",
  "arguments": {
    "receive_id_type": "chat_id",
    "receive_id": "oc_xxxxx",
    "task": {
      "title": "Deploy Task",
      "titleTemplate": "blue",
      "status": "doing",
      "subtasks": [
        { "id": "s1", "label": "Prepare", "status": "done" },
        { "id": "s2", "label": "Deploy", "status": "doing" }
      ],
      "messages": [
        { "text": "Task started", "level": "info" }
      ]
    }
  }
}
```

#### task_card_update

Update existing task card.

```javascript
{
  "name": "task_card_update",
  "arguments": {
    "task_id": "task_xxxxx",
    "status": "done",
    "subtasks": [...],
    "messages": [...]
  }
}
```

#### task_card_append

Append subtask or message to existing card.

```javascript
{
  "name": "task_card_append",
  "arguments": {
    "task_id": "task_xxxxx",
    "message": { "text": "Progress: 50%", "level": "info" },
    "set_status": "doing"
  }
}
```

#### task_card_get

Get task current state.

```javascript
{
  "name": "task_card_get",
  "arguments": { "task_id": "task_xxxxx" }
}
```

#### task_card_delete

Delete task card.

```javascript
{
  "name": "task_card_delete",
  "arguments": { "task_id": "task_xxxxx" }
}
```

#### task_card_health

Health check.

```javascript
{
  "name": "task_card_health",
  "arguments": {}
}
```

### Development

```bash
# Install dependencies (none required, pure JS)
npm install

# Run tests
npm test

# Check syntax
npm run check
```

### Dependencies

- **Runtime**: Node.js >= 18.0.0
- **No external dependencies** - Pure ESM modules

### File Structure

```
feishu-card-enhanced/
├── index.js              # Main entry point
├── src/
│   └── services/
│       ├── content-parser.js    # Markdown parser
│       └── content-renderer.js  # Feishu component renderer
├── test/                # Test files
├── docs/                # Documentation
├── openclaw.plugin.json # Plugin config
└── package.json
```

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.3.0 | 2026-03-22 | 30+ optimizations, markdown rendering, emoji support |
| 1.2.0 | 2026-03-21 | Error retry, state persistence |
| 1.1.0 | 2026-03-20 | Initial release |

### License

MIT License

---

## 中文

### 概述

飞书任务卡片增强插件是 OpenClaw 的插件，用于展示分步任务进度和消息流的飞书互动卡片。

### 功能特性

- ✅ **任务追踪**：创建分步任务，实时追踪进度
- ✅ **动态更新**：支持卡片内容实时更新
- ✅ **消息流**：追加消息日志，记录执行过程
- ✅ **状态持久化**：自动保存任务状态，重启不丢失
- ✅ **错误重试**：内置重试机制，提高成功率
- ✅ **交互按钮**：支持重试、继续等操作按钮
- ✅ **Markdown渲染**：表格、代码块、图片、链接
- ✅ **Emoji简码**：`:rocket:` → 🚀 自动展开
- ✅ **URL自动链接**：URL转可点击链接
- ✅ **时间排序**：按时间戳排序消息
- ✅ **智能展开**：内容少时自动展开

### 安装

#### 1. 通过 OpenClaw 安装

```bash
# 复制到扩展目录
cp -r feishu-card-enhanced/ ~/.openclaw/extensions/
```

#### 2. 配置飞书应用

在 [飞书开放平台](https://open.feishu.cn/) 创建应用，获取：

- `appId` (应用ID)
- `appSecret` (应用密钥)

添加到 OpenClaw 配置：

```json
{
  "channels": {
    "feishu": {
      "appId": "cli_xxxxxxxx",
      "appSecret": "xxxxxxxxxxxxx"
    }
  }
}
```

#### 3. 权限要求

确保飞书应用有以下权限：
- `im:message:send_as_bot` - 发送消息
- `im:card:create` - 创建互动卡片
- `im:message:update` - 更新消息
- `im:message:delete` - 删除消息

### 工具

#### task_card_create

创建任务卡片。

```javascript
{
  "name": "task_card_create",
  "arguments": {
    "receive_id_type": "chat_id",
    "receive_id": "oc_xxxxx",
    "task": {
      "title": "部署任务",
      "titleTemplate": "blue",
      "status": "doing",
      "subtasks": [
        { "id": "s1", "label": "准备", "status": "done" },
        { "id": "s2", "label": "部署", "status": "doing" }
      ],
      "messages": [
        { "text": "任务开始", "level": "info" }
      ]
    }
  }
}
```

#### task_card_update

更新任务卡片。

#### task_card_append

追加子任务或消息到现有卡片。

#### task_card_get

获取任务当前状态。

#### task_card_delete

删除任务卡片。

#### task_card_health

健康检查。

### 开发

```bash
# 安装依赖（无需外部依赖）
npm install

# 运行测试
npm test

# 检查语法
npm run check
```

### 依赖

- **运行时**：Node.js >= 18.0.0
- **无外部依赖** - 纯 ESM 模块

### 文件结构

```
feishu-card-enhanced/
├── index.js              # 主入口
├── src/
│   └── services/
│       ├── content-parser.js    # Markdown解析器
│       └── content-renderer.js # 飞书组件渲染器
├── test/                # 测试文件
├── docs/                # 文档
├── openclaw.plugin.json # 插件配置
└── package.json
```

### 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.3.0 | 2026-03-22 | 30+优化，Markdown渲染，Emoji支持 |
| 1.2.0 | 2026-03-21 | 错误重试，状态持久化 |
| 1.1.0 | 2026-03-20 | 初始版本 |

### 许可证

MIT License

---

**作者**: 杨博  
**最后更新**: 2026-03-22