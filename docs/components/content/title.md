# Title 组件

## 组件概述
卡片标题组件支持添加主标题、副标题、后缀标签和标题图标。

## Tag
```json
{
  "tag": "plain_text"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| title | 是 | Object | 配置卡片的主标题信息 |
| └ tag | 是 | String | 文本类型标签，可选值：`plain_text`、`lark_md` |
| └ content | 否 | String | 卡片主标题内容，最多 4 行，超出会截断 |
| subtitle | 否 | Object | 配置卡片的副标题信息 |
| └ tag | 是 | String | 文本类型标签 |
| └ content | 否 | String | 卡片副标题内容，最多 1 行 |
| text_tag_list | 否 | Array | 标题的后缀标签，最多 3 个 |
| i18n_text_tag_list | 否 | Object | 多语言后缀标签配置 |
| template | 否 | String | 标题主题色，支持 blue、wathet、turquoise 等 |
| icon | 否 | Object | 添加图标作为文字前缀 |
| padding | 否 | String | 标题组件的内边距，默认 12px |

## 示例代码

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "plain_text",
          "content": "示例文本"
        }
      }
    ]
  },
  "header": {
    "title": {
      "tag": "lark_md",
      "content": ":Partying:卡片主标题 "
    },
    "subtitle": {
      "tag": "plain_text",
      "content": "卡片副标题"
    },
    "text_tag_list": [
      {
        "tag": "text_tag",
        "text": {
          "tag": "plain_text",
          "content": "标签 1"
        },
        "color": "blue"
      }
    ],
    "template": "blue",
    "icon": {
      "tag": "standard_icon",
      "token": "larkcommunity_colorful"
    },
    "padding": "12px"
  }
}
```

## 注意事项

1. 同一卡片中只能添加一个标题组件
2. 如果只配置副标题，副标题会实际显示为主标题
3. 主标题内容最多 4 行，副标题最多 1 行，超出会截断
4. 支持多语言配置
5. 图标支持标准图标库和自定义图标

## 主题色枚举

支持的主题色：blue, wathet, turquoise, green, yellow, orange, red, carmine, violet, purple, indigo, grey, default
