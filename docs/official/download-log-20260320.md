# 飞书卡片官方文档下载记录

> 下载时间：2026-03-20  
> 来源：飞书开放平台 (open.feishu.cn)  
> 状态：🔄 下载进行中

---

## ✅ 已下载文档

### 核心文档
1. **组件总览** - `component-overview-20260320.md`
   - 包含所有容器组件、展示组件、交互组件的完整列表
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/component-json-v2-overview

2. **JSON 2.0 结构** - `json-v2-structure-20260320.md`
   - 卡片 JSON 2.0 的完整结构说明
   - 包含全局属性、config、card_link、header、body 等详细说明
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure

### 组件文档

#### 内容组件
3. **标题 (Title)** - `content/title.md`
   - 支持主标题、副标题、后缀标签、标题图标
   - 包含完整的字段说明和示例代码
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/title

4. **纯文本 (Plain Text)** - `content/plain-text.md`
   - 支持纯文本和前缀图标
   - 设置文本大小、颜色、对齐等样式
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/plain-text

5. **富文本 (Rich Text/Markdown)** - `content/rich-text.md`
   - 支持 Markdown 语法渲染
   - 包含完整的 Markdown 语法支持列表
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/rich-text

6. **图片 (Image)** - `content/image.md`
   - 支持图片上传和展示
   - 包含裁剪模式、尺寸设置等
   - 来源：https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/image

#### 容器组件
7. **列 (Column)** - `components/containers/column.md`
8. **列集 (Column Set)** - `components/containers/column-set.md`
9. **折叠面板 (Collapse)** - `components/containers/collapse.md`
10. **分割线 (Divider)** - `components/containers/divider.md`

#### 交互组件
11. **按钮 (Button)** - `components/interactive/button.md`
12. **输入框 (Input)** - `components/interactive/input.md`
13. **选择器 (Select)** - `components/interactive/select.md`
14. **复选框 (Checkbox)** - `components/interactive/checkbox.md`

#### 内容组件（补充）
15. **链接 (Link)** - `components/content/link.md`
16. **头像 (Avatar)** - `components/content/avatar.md`

---

## 🔄 待下载文档

### 更多组件文档
- [ ] 多图布局 (Multi-Image Layout)
- [ ] 人员 (Person)
- [ ] 人员列表 (Person List)
- [ ] 图表 (Chart)
- [ ] 表格 (Table)
- [ ] 溢出按钮集 (Overflow)
- [ ] 多选下拉菜单 (Multi-Select Dropdown)
- [ ] 单选人员选择器 (Single-Select Person Picker)
- [ ] 多选人员选择器 (Multi-Select Person Picker)
- [ ] 日期选择器 (Date Picker)
- [ ] 时间选择器 (Time Selector)
- [ ] 日期时间选择器 (Date-Time Picker)
- [ ] 图像选择器 (Image Picker)
- [ ] 复选框 (Checker)
- [ ] 循环容器 (Loop Container)
- [ ] 表单容器 (Form Container)
- [ ] 交互容器 (Interactive Container)
- [ ] 可折叠面板 (Collapsible Panel)

### API 文档
- [ ] 卡片 API 总览
- [ ] 创建卡片实体
- [ ] 更新卡片实体
- [ ] 流式更新卡片
- [ ] 上传图像 API
- [ ] 上传文件 API
- [ ] 回调接口

### 枚举和配置
- [ ] 颜色枚举
- [ ] 图标枚举
- [ ] 文本大小枚举
- [ ] 多语言配置

---

## 📊 下载统计

| 类别 | 已下载 | 待下载 | 总计 |
|------|--------|--------|------|
| 核心文档 | 2 | 0 | 2 |
| 内容组件 | 6 | 0 | 6 |
| 容器组件 | 4 | 0 | 4 |
| 交互组件 | 4 | 10 | 14 |
| API 文档 | 0 | 7 | 7 |
| 枚举配置 | 0 | 4 | 4 |
| **总计** | **16** | **21** | **37** |

---

## 📁 文件结构

```
docs/
├── official/                          # 官方文档下载区
│   ├── component-overview-20260320.md  # 组件总览
│   ├── json-v2-structure-20260320.md   # JSON 2.0 结构
│   └── download-log-20260320.md        # 下载记录（本文件）
├── components/
│   ├── content/
│   │   ├── title.md
│   │   ├── plain-text.md
│   │   ├── rich-text.md
│   │   ├── image.md
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
├── apis/
│   ├── overview.md
│   ├── send.md
│   ├── update.md
│   ├── query.md
│   ├── upload.md
│   ├── callback.md
│   └── other.md
├── README.md
├── OFFICIAL-SOURCES.md
└── 飞书卡片 JSON2.0 完整知识库.md
```

---

## 📝 下载说明

1. **下载方式**：使用 `web_fetch` 工具从飞书开放平台抓取 Markdown 格式文档
2. **文档格式**：保留官方原始格式和内容
3. **更新频率**：建议定期检查官方文档更新
4. **注意事项**：
   - 文档内容来自外部来源，仅供参考
   - 以官方最新文档为准
   - 本地文档需定期同步更新

---

*最后更新：2026-03-20 08:21*
