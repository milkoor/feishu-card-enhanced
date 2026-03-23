# Column 列组件

## 组件概述
列组件用于在卡片中创建垂直布局，将内容分为多列显示。支持自适应宽度和固定宽度。

## Tag
```json
{ "tag": "column" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `column` |
| width | 否 | String | auto | 列宽度，支持 `auto`、`fill` 或百分比 |
| weight | 否 | Number | 1 | 列的权重，用于自动分配空间 |
| vertical_align | 否 | String | top | 垂直对齐方式：`top`, `middle`, `bottom` |
| elements | 否 | Array | [] | 列内包含的元素数组 |

## 宽度设置

| 值 | 说明 |
|----|------|
| `auto` | 根据内容自动调整宽度 |
| `fill` | 填充剩余空间 |
| `50%` | 百分比宽度（相对于父容器） |

## 垂直对齐

| 值 | 说明 |
|----|------|
| `top` | 顶部对齐（默认） |
| `middle` | 居中对齐 |
| `bottom` | 底部对齐 |

## 示例代码

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
                "tag": "plain_text",
                "content": "左侧内容",
                "margin": "0px"
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
                "tag": "plain_text",
                "content": "右侧内容",
                "margin": "0px"
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
1. 列组件必须嵌套在 `column_set` 容器中使用
2. 多列时建议设置 `weight` 以控制比例
3. 列内可以继续嵌套其他容器组件
4. 移动端会自适应为单列显示
