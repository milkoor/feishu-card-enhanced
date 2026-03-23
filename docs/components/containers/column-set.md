# Column Set 列集组件

## 组件概述
列集组件用于创建多列布局，支持流式布局和固定布局两种模式。是将卡片内容分为多列显示的核心容器组件。

## Tag
```json
{ "tag": "column_set" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `column_set` |
| flex_mode | 否 | String | flow | 布局模式：`flow` (流式) 或 `flex` (弹性) |
| background_style | 否 | String | default | 背景样式 |
| columns | 否 | Array | [] | 列数组，包含多个 `column` 对象 |

## 布局模式

### flow (流式布局)
- 列按照设置的宽度依次排列
- 超出宽度会自动换行
- 适合内容块固定的场景

### flex (弹性布局)
- 列会根据权重自动分配空间
- 更适合响应式布局
- 推荐用于移动端优先的场景

## 背景样式

| 值 | 说明 |
|----|------|
| `default` | 默认背景（白色） |
| `grey` | 灰色背景 |
| `transparent` | 透明背景 |

## 示例代码

### 基础双列布局
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "column_set",
        "flex_mode": "flow",
        "background_style": "default",
        "columns": [
          {
            "tag": "column",
            "width": "fill",
            "weight": 1,
            "vertical_align": "top",
            "elements": [
              {
                "tag": "div",
                "text": {
                  "tag": "lark_md",
                  "content": "**左侧内容**\n支持 Markdown 格式"
                }
              }
            ]
          },
          {
            "tag": "column",
            "width": "fill",
            "weight": 1,
            "vertical_align": "top",
            "elements": [
              {
                "tag": "img",
                "src": {
                  "tag": "image_url",
                  "image_url": "https://example.com/image.png"
                },
                "alt": {
                  "tag": "plain_text",
                  "content": "示例图片"
                },
                "mode": "fit_horizontal",
                "preview": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 三列等分布局
```json
{
  "tag": "column_set",
  "flex_mode": "flex",
  "background_style": "grey",
  "columns": [
    {
      "tag": "column",
      "weight": 1,
      "elements": [
        {
          "tag": "plain_text",
          "content": "第一列"
        }
      ]
    },
    {
      "tag": "column",
      "weight": 1,
      "elements": [
        {
          "tag": "plain_text",
          "content": "第二列"
        }
      ]
    },
    {
      "tag": "column",
      "weight": 1,
      "elements": [
        {
          "tag": "plain_text",
          "content": "第三列"
        }
      ]
    }
  ]
}
```

## 注意事项
1. 列集组件不能嵌套在自身内部
2. 建议为列设置合理的宽度或权重
3. 移动端会自动调整为单列显示
4. 列内元素过多时注意滚动体验
