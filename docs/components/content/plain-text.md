# Plain Text 组件

## 组件概述
卡片普通文本组件支持添加纯文本和前缀图标，并可设置文本大小、颜色、对齐方式等显示样式。

## Tag
```json
{
  "tag": "div"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `div` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距，范围 [-99,99]px |
| width | 否 | String | fill | 文本宽度，支持 fill、auto、[16,999]px |
| text | 否 | Object | / | 配置卡片纯文本信息 |
| └ tag | 是 | String | plain_text | 文本类型标签 |
| └ element_id | 否 | String | 空 | 文本元素 ID |
| └ content | 是 | String | / | 文本内容 |
| └ text_size | 否 | String | normal | 文本大小 |
| └ text_color | 否 | String | default | 文本颜色 |
| └ text_align | 否 | String | left | 文本对齐方式 |
| └ lines | 否 | Int | / | 最大显示行数 |
| icon | 否 | Object | / | 前缀图标 |

## 示例代码

### plain_text 类型示例

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "element_id": "div01",
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
        },
        "margin": "0px 0px 0px 0px"
      }
    ]
  }
}
```

### lark_md 类型示例

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "plain_text",
          "content": "text-lark_md",
          "lines": 1
        },
        "fields": [
          {
            "is_short": false,
            "text": {
              "tag": "lark_md",
              "content": "<a>https://open.feishu.cn</a>"
            }
          }
        ]
      }
    ]
  }
}
```

## 注意事项

1. 支持 plain_text 和 lark_md 两种文本类型
2. lark_md 支持部分 Markdown 语法
3. 支持自定义移动端和桌面端不同字体大小
4. 文本颜色支持颜色枚举值
