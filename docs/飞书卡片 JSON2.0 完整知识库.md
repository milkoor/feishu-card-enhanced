# 飞书卡片 JSON 2.0 完整知识库

> 来源：飞书开放平台官方文档
> 更新时间：2026-03-20
> 状态：✅ 已验证

---

## 📋 目录

1. [JSON 2.0 基础结构](#json-20-基础结构)
2. [展示类组件](#展示类组件)
3. [交互类组件](#交互类组件)
4. [容器类组件](#容器类组件)
5. [颜色枚举](#颜色枚举)
6. [图标枚举](#图标枚举)

---

## JSON 2.0 基础结构

```json
{
  "schema": "2.0",
  "config": {
    "wide_screen_mode": true,
    "enable_forward": false,
    "update_multi": true
  },
  "header": {
    "template": "blue",
    "title": {
      "tag": "plain_text",
      "content": "卡片标题"
    }
  },
  "body": {
    "elements": []
  }
}
```

### 核心字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `schema` | String | 是 | JSON 结构版本，必须声明为 `"2.0"` |
| `config` | Object | 否 | 全局配置 |
| `header` | Object | 否 | 卡片头部（标题栏） |
| `body` | Object | 是 | 卡片主体内容 |
| `body.elements` | Array | 是 | 元素数组，按顺序渲染 |

---

## 展示类组件

### 1. 标题 (header)

**Tag**: `header` (在 body.elements 中使用)

```json
{
  "header": {
    "title": {
      "tag": "plain_text",
      "content": "主标题"
    },
    "subtitle": {
      "tag": "plain_text",
      "content": "副标题"
    },
    "template": "blue",
    "icon": {
      "tag": "standard_icon",
      "token": "larkcommunity_colorful"
    }
  }
}
```

**字段说明**：
- `title.tag`: `"plain_text"` 或 `"lark_md"`
- `title.content`: 主标题内容（最多 4 行）
- `subtitle.content`: 副标题内容（最多 1 行）
- `template`: 主题色，枚举值：
  - `blue`, `wathet`, `turquoise`, `green`, `yellow`, `orange`, `red`, `carmine`, `violet`, `purple`, `indigo`, `grey`, `default`

---

### 2. 普通文本 (div)

**Tag**: `div`

```json
{
  "tag": "div",
  "element_id": "div01",
  "margin": "0px",
  "width": "fill",
  "text": {
    "tag": "plain_text",
    "element_id": "plaintext01",
    "content": "这是示例文本。",
    "text_size": "normal",
    "text_align": "center",
    "text_color": "default"
  },
  "icon": {
    "tag": "standard_icon",
    "token": "reply-cn_filled",
    "color": "blue"
  }
}
```

**字段说明**：
- `text.tag`: `"plain_text"` (纯文本) 或 `"lark_md"` (支持 Markdown)
- `text.content`: 文本内容
- `text.text_size`: 字体大小
  - `heading-0` (30px), `heading-1` (24px), `heading-2` (20px), `heading-3` (18px), `heading-4` (16px), `heading` (16px), `normal` (14px), `notation` (12px)
- `text.text_align`: `"left"`, `"center"`, `"right"`
- `text.text_color`: 颜色枚举
- `icon`: 前缀图标

**lark_md 支持的语法**：
- 换行：`\n`
- 斜体：`*Italic*`
- 粗体：`**Bold**`
- 删除线：`~~Strikethrough~~`
- 超链接：`[文字链接](https://...)`
- @ 提及：`<at id=all></at>`, `<at id=open_id></at>`
- 表情：`😁` 或 `:OK:`
- 标签：`<text_tag color='blue'>标签</text_tag>`

---

### 3. 富文本 (markdown)

**Tag**: `markdown`

```json
{
  "tag": "markdown",
  "element_id": "md01",
  "margin": "0px",
  "content": "# 一级标题\n\n**粗体** *斜体* ~~删除线~~\n\n- 无序列表 1\n- 无序列表 2\n\n1. 有序列表 1\n2. 有序列表 2\n\n[文字链接](https://open.feishu.cn)\n\n<at id=all></at>",
  "text_size": "normal",
  "text_align": "left"
}
```

**支持的 Markdown 语法**：
- 标题：`# H1`, `## H2`, ..., `###### H6`
- 列表：`- 无序`, `1. 有序`
- 引用：`> 引用文本`
- 代码块：\`\`\`language\n代码\n\`\`\`
- 行内代码：`` `code` ``
- 表格：`| 表头 | 表头 |`
- 分割线：`---`
- 图片：`![描述](image_key)`
- 人员：`<person id='ou_xxx' show_name=true show_avatar=true></person>`
- 音频：`<audio file_key='file_v3_xxx'></audio>`

---

### 4. 图片 (img)

**Tag**: `img`

```json
{
  "tag": "img",
  "img_key": "img_v2_xxx",
  "alt": {
    "tag": "plain_text",
    "content": "图片描述"
  }
}
```

**获取 img_key**：调用上传接口上传图片后从响应获取

---

### 5. 分割线 (hr)

**Tag**: `hr`

```json
{
  "tag": "hr"
}
```

---

### 6. 进度条 (progress)

**Tag**: `progress`

```json
{
  "tag": "progress",
  "value": 75,
  "text": {
    "tag": "plain_text",
    "content": "整体进度：75%"
  }
}
```

**字段说明**：
- `value`: 0-100 的整数
- `text.content`: 进度文本

---

### 7. 备注 (note)

**Tag**: `note`

```json
{
  "tag": "note",
  "elements": [
    {
      "tag": "plain_text",
      "content": "备注信息"
    }
  ]
}
```

---

## 交互类组件

### 1. 按钮 (button)

**Tag**: `button`

```json
{
  "tag": "button",
  "element_id": "btn01",
  "margin": "0px",
  "type": "primary",
  "size": "medium",
  "width": "default",
  "text": {
    "tag": "plain_text",
    "content": "确认"
  },
  "icon": {
    "tag": "standard_icon",
    "token": "check_filled"
  },
  "hover_tips": {
    "tag": "plain_text",
    "content": "提示信息"
  },
  "disabled": false,
  "behaviors": [
    {
      "type": "open_url",
      "default_url": "https://example.com"
    },
    {
      "type": "callback",
      "value": {
        "key": "value"
      }
    }
  ]
}
```

**字段说明**：
- `type`: 按钮类型
  - `default`: 默认（黑色边框）
  - `primary`: 主要（蓝色）
  - `danger`: 危险（红色）
  - `text`, `primary_text`, `danger_text`: 文本按钮
  - `primary_filled`, `danger_filled`: 填充按钮
  - `laser`: 镭射按钮
- `size`: 尺寸
  - `tiny` (24px), `small` (28px), `medium` (32px), `large` (40px)
- `width`: 宽度
  - `default`: 默认
  - `fill`: 填满
  - `[100,∞)px`: 自定义如 `120px`
- `behaviors`: 交互行为数组
  - `type: "open_url"`: 跳转链接
  - `type: "callback"`: 回调服务器

---

### 2. 输入框 (input)

**Tag**: `input`

```json
{
  "tag": "input",
  "name": "input_name",
  "placeholder": {
    "tag": "plain_text",
    "content": "请输入..."
  }
}
```

**字段说明**：
- `name`: 字段名（表单提交时使用）
- `placeholder.content`: 占位符文本

---

### 3. 下拉选择 (select_static)

**Tag**: `select_static`

```json
{
  "tag": "select_static",
  "name": "select_name",
  "placeholder": {
    "tag": "plain_text",
    "content": "请选择"
  },
  "options": [
    {
      "value": "option1",
      "text": {
        "tag": "plain_text",
        "content": "选项 1"
      }
    },
    {
      "value": "option2",
      "text": {
        "tag": "plain_text",
        "content": "选项 2"
      }
    }
  ]
}
```

---

### 4. 日期选择器 (date_picker)

**Tag**: `date_picker`

```json
{
  "tag": "date_picker",
  "name": "date_name",
  "placeholder": {
    "tag": "plain_text",
    "content": "选择日期"
  }
}
```

---

## 容器类组件

### 1. 分栏 (column_set)

**Tag**: `column_set`

```json
{
  "tag": "column_set",
  "flex_mode": "none",
  "horizontal_spacing": "default",
  "background_style": "default",
  "columns": [
    {
      "tag": "column",
      "width": "weighted",
      "weight": 1,
      "vertical_align": "top",
      "elements": [
        {
          "tag": "div",
          "text": {
            "tag": "plain_text",
            "content": "第一列内容"
          }
        }
      ]
    },
    {
      "tag": "column",
      "width": "weighted",
      "weight": 1,
      "elements": [
        {
          "tag": "div",
          "text": {
            "tag": "plain_text",
            "content": "第二列内容"
          }
        }
      ]
    }
  ]
}
```

**字段说明**：
- `flex_mode`: 布局模式
  - `none`: 普通布局
  - `flow`: 流式布局
- `horizontal_spacing`: 列间距
  - `default`, `none`, `small`, `medium`, `large`
- `columns[].width`: 列宽度
  - `weighted`: 按比例分配
  - `auto`: 自适应
- `columns[].weight`: 权重（当 width="weighted" 时）
- `columns[].vertical_align`: 垂直对齐
  - `top`, `center`, `bottom`

---

### 2. 折叠面板 (collapsible_panel)

**Tag**: `collapsible_panel`

```json
{
  "tag": "collapsible_panel",
  "name": {
    "tag": "plain_text",
    "content": "折叠面板标题"
  },
  "folded": false,
  "children": [
    {
      "tag": "div",
      "text": {
        "tag": "plain_text",
        "content": "折叠内容"
      }
    }
  ]
}
```

---

### 3. 折叠按钮组 (overflow)

**Tag**: `overflow`

```json
{
  "tag": "overflow",
  "text": {
    "tag": "plain_text",
    "content": "更多操作"
  },
  "actions": [
    {
      "tag": "button",
      "text": {
        "tag": "plain_text",
        "content": "按钮 1"
      }
    },
    {
      "tag": "button",
      "text": {
        "tag": "plain_text",
        "content": "按钮 2"
      }
    }
  ]
}
```

---

## 颜色枚举

### 主题色

| 枚举值 | 说明 |
|--------|------|
| `blue` | 蓝色 |
| `wathet` | 天蓝色 |
| `turquoise` | 青绿色 |
| `green` | 绿色 |
| `yellow` | 黄色 |
| `orange` | 橙色 |
| `red` | 红色 |
| `carmine` | 深红色 |
| `violet` | 紫罗兰色 |
| `purple` | 紫色 |
| `indigo` | 靛蓝色 |
| `grey` | 灰色 |
| `default` | 默认色 |

### 文本颜色

- `default`: 默认（浅色模式黑色，深色模式白色）
- `red`, `green`, `blue`, `orange`, `grey` 等

---

## 图标枚举

图标库包含数百个官方图标，通过 `token` 字段指定。

**常用图标**：
- `check_filled`: 对勾
- `chat_outlined`: 聊天
- `calendar_filled`: 日历
- `user_filled`: 用户
- `settings_filled`: 设置
- `notification_filled`: 通知
- `file_filled`: 文件
- `image_filled`: 图片

**完整图标库**：[飞书图标库](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-icons)

---

## 最佳实践

### 1. 卡片结构

```json
{
  "schema": "2.0",
  "header": {
    "template": "blue",
    "title": {
      "tag": "plain_text",
      "content": "📋 任务卡片"
    }
  },
  "body": {
    "elements": [
      {
        "tag": "progress",
        "value": 75,
        "text": {
          "tag": "plain_text",
          "content": "整体进度：75%"
        }
      },
      {
        "tag": "column_set",
        "columns": [
          {
            "tag": "column",
            "width": "weighted",
            "elements": [
              {
                "tag": "div",
                "text": {
                  "tag": "lark_md",
                  "content": "✅ 步骤 1 - 已完成\n\n🔄 步骤 2 - 进行中\n\n⏳ 步骤 3 - 待开始"
                }
              }
            ]
          }
        ]
      },
      {
        "tag": "fold",
        "name": {
          "tag": "plain_text",
          "content": "📝 执行日志"
        },
        "children": [
          {
            "tag": "markdown",
            "content": "[12:00] ℹ️ 任务开始\n[12:01] ✅ 步骤 1 完成"
          }
        ]
      },
      {
        "tag": "button",
        "type": "primary",
        "text": {
          "tag": "plain_text",
          "content": "确认完成"
        },
        "behaviors": [
          {
            "type": "callback",
            "value": {
              "action": "complete"
            }
          }
        ]
      }
    ]
  }
}
```

---

## 更新日志

- 2026-03-20: 初始版本，整理 JSON 2.0 完整结构
- 来源：飞书开放平台官方文档

---

**文档链接**：
- [JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)
- [组件总览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/component-json-v2-overview)
- [图标库](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-icons)
- [颜色枚举](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/enumerations-for-fields-related-to-color)
