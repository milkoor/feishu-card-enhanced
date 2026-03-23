# Rich Text 组件

## 组件概述
卡片富文本（Markdown）组件支持渲染文本、图片、分割线等元素。

## Tag
```json
{
  "tag": "markdown"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `markdown` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距 |
| text_align | 否 | String | left | 文本对齐方式 |
| text_size | 否 | String | normal | 文本大小 |
| icon | 否 | Object | / | 前缀图标 |
| content | 是 | String | / | Markdown 文本内容 |

## 支持的 Markdown 语法

### 基础语法

| 功能 | 语法 | 说明 |
|------|------|------|
| 换行 | `第一行<br>第二行` | 支持软换行和硬换行 |
| 斜体 | `*斜体*` | 支持 |
| 粗体 | `**粗体**` 或 `__粗体__` | 支持 |
| 删除线 | `~~删除线~~` | 支持 |
| 文本链接 | `[文字链接](https://url)` | 超链接必须包含 schema |
| 超链接 | `<a href='url'></a>` | 支持 HTTP 和 HTTPS |
| @提及 | `<at id=open_id></at>` | 支持多种 ID 类型 |
| 表情符号 | `:OK:` | 飞书表情 |
| 标签 | `<text_tag color='red'>文本</text_tag>` | 支持多种颜色 |
| 代码块 | ` ```JSON {...} ``` ` | 支持多种编程语言 |
| 表格 | `| 表头 | 表头 |` | 最多显示 5 行数据 |
| 有序列表 | `1. 列表项` | 4 个空格表示一级缩进 |
| 无序列表 | `- 列表项` | 4 个空格表示一级缩进 |

## 示例代码

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "markdown",
        "content": "# 一级标题",
        "margin": "0px 0px 0px 0px", 
        "text_align": "left",
        "text_size": "normal"
      },
      {
        "tag": "markdown",
        "content": "标准 emoji 😁😢🌞💼🏆❌✅\n飞书 emoji :OK::THUMBSUP:\n*斜体* **粗体** ~~删除线~~ \n这是红色文本</font>\n<text_tag color=\"blue\">标签</text_tag>\n[文字链接](https://open.feishu.cn/document/server-docs/im-v1/message-reaction/emojis-introduce)\n<link icon='chat_outlined' url='https://open.feishu.cn' pc_url='' ios_url='' android_url=''>带图标的链接</link>\n<at id=all></at>\n- 无序列表 1\n - 无序列表 1.1\n- 无序列表 2\n1. 有序列表 1\n 1. 有序列表 1.1\n2. 有序列表 2\n```JSON\n{\"This is\": \"JSON demo\"}\n```"
      }
    ]
  }
}
```

## 注意事项

1. JSON 2.0 结构不再支持差异化跳转语法
2. 支持所有标准 Markdown 语法和部分 HTML 语法
3. 富文本组件不支持 HTMLBlock
4. 支持在移动端和桌面端定义不同字体大小
5. 特殊字符需要进行 HTML 转义
