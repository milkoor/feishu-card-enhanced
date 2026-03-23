# Button 按钮组件

## 组件概述
按钮组件是交互组件，支持多种样式和尺寸，支持添加图标作为前缀图标。

## Tag
```json
{
  "tag": "button"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `button` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距 |
| type | 否 | String | default | 按钮类型 |
| size | 否 | String | medium | 按钮尺寸 |
| width | 否 | String | default | 按钮宽度 |
| text | 否 | Struct | / | 按钮上的文本 |
| icon | 否 | Struct | / | 前缀图标 |
| hover_tips | 否 | Struct | / | PC 端悬停提示文字 |
| disabled | 否 | Boolean | false | 是否禁用按钮 |
| disabled_tips | 否 | Struct | / | 禁用状态悬停提示 |
| confirm | 否 | Struct | / | 二次确认弹窗配置 |
| behaviors | 否 | Array | / | 交互行为数组 |

## 按钮类型

| 类型 | 说明 |
|------|------|
| default | 带边框黑色字体按钮 |
| primary | 带边框蓝色字体按钮 |
| danger | 带边框红色字体按钮 |
| text | 无边框黑色字体按钮 |
| primary_text | 无边框蓝色字体按钮 |
| danger_text | 无边框红色字体按钮 |
| primary_filled | 蓝底白字按钮 |
| danger_filled | 红底白字按钮 |
| laser | 镭射按钮 |

## 按钮尺寸

| 尺寸 | PC 高度 | 移动端高度 |
|------|---------|-----------|
| tiny | 24px | 28px |
| small | 28px | 28px |
| medium | 32px | 36px |
| large | 40px | 48px |

## 示例代码

```json
{
  "schema": "2.0",
  "header": {
    "template": "blue",
    "title": {
      "content": "按钮示例",
      "tag": "plain_text"
    }
  },
  "body": {
    "elements": [
      {
        "tag": "column_set",
        "flex_mode": "flow",
        "background_style": "default",
        "columns": [
          {
            "tag": "column",
            "width": "auto",
            "weight": 1,
            "vertical_align": "top",
            "elements": [
              {
                "tag": "button",
                "text": {
                  "tag": "plain_text",
                  "content": "镭射按钮"
                },
                "behaviors": [
                  {
                    "type": "open_url",
                    "default_url": "https://open.feishu.cn/document",
                    "android_url": "https://developer.android.com/",
                    "ios_url": "lark://msgcard/unsupported_action",
                    "pc_url": "https://www.windows.com"
                  }
                ],
                "type": "laser",
                "hover_tips": {
                  "tag": "plain_text",
                  "content": "hover 提示"
                },
                "value": {
                  "key": "value"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 注意事项

1. JSON 2.0 结构不再支持交互模块相关属性
2. 按钮可直接放置在 elements 中，配置适当的组件间距
3. 支持嵌套在列、表单容器、折叠面板等容器中
4. 表单容器中的按钮需要配置 name 和 form_action_type
