# 飞书卡片官方文档来源

> 📚 官方文档原始链接  
> 整理时间：2026-03-20  
> 来源：飞书开放平台 (open.feishu.cn)

---

## 🌐 主文档

### 卡片 JSON 2.0 结构
- **JSON 2.0 结构说明**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure

### 组件相关
- **组件总览**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/component-json-v2-overview

- **图标枚举**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-icons

- **颜色相关枚举**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-fields-related-to-color

---

## 📡 API 文档

### API 总览
- **卡片 API 总览**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/overview

- **消息卡片资源总览**  
  https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message-card/overview

### 卡片套件 API
- **卡片套件概述**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/overview

- **创建卡片实体**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/create-card

- **更新卡片实体**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/update-card

- **流式更新卡片**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-update-card

---

## 📦 组件文档

### 内容组件
- **标题 (Title)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/title

- **纯文本 (Plain Text)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/plain-text

- **富文本 (Rich Text)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/rich-text

- **图片 (Image)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/image

- **多图 (Multi-Image)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/multi-image

### 交互组件
- **按钮 (Button)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/button

- **输入框 (Input)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/input

- **选择器 (Select)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/select

- **复选框 (Checkbox)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/checkbox

### 容器组件
- **列 (Column)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/column

- **列集 (Column Set)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/column-set

- **折叠面板 (Collapse)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/collapse

- **分割线 (Divider/HR)**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/hr

---

## 🔗 相关链接

- **飞书开放平台首页**  
  https://open.feishu.cn/document

- **飞书卡片开发指南**  
  https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/overview

- **飞书社区**  
  https://open.feishu.cn/community

---

## 📝 文档同步说明

### 本地文档 vs 官方文档
| 项目 | 本地文档 | 官方文档 |
|------|----------|----------|
| 位置 | `/home/mk/.openclaw/extensions/feishu-card-enhanced/docs/` | https://open.feishu.cn/document/ |
| 格式 | Markdown | 网页 |
| 更新 | 手动同步 | 官方维护 |
| 访问 | 离线可用 | 需要网络 |

### 同步建议
1. **定期检查**官方文档更新
2. **对比差异**后同步重要变更
3. **保留本地注释**和示例代码
4. **维护文档索引**确保链接有效

---

## 📋 文档清单

### 已下载文档 (24 个)
```
docs/
├── README.md
├── OFFICIAL-SOURCES.md (本文件)
├── 飞书卡片 JSON2.0 完整知识库.md
├── apis/
│   ├── overview.md
│   ├── send.md
│   ├── update.md
│   ├── query.md
│   ├── upload.md
│   ├── callback.md
│   └── other.md
├── components/
│   ├── content/
│   │   ├── title.md
│   │   ├── plain-text.md
│   │   ├── rich-text.md
│   │   ├── image.md
│   │   ├── multi-image.md
│   │   ├── link.md
│   │   └── avatar.md
│   ├── interactive/
│   │   ├── button.md
│   │   ├── input.md
│   │   ├── select.md
│   │   └── checkbox.md
│   └── containers/
│       ├── column.md
│       ├── column-set.md
│       ├── collapse.md
│       └── divider.md
```

### 官方文档链接 (已整理)
- ✅ JSON 2.0 结构
- ✅ 组件总览
- ✅ 图标枚举
- ✅ 颜色枚举
- ✅ API 总览
- ✅ 消息卡片资源总览
- ✅ 各组件详细文档

---

*最后更新：2026-03-20*
