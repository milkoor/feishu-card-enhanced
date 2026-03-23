# Divider 分割线组件

## 组件概述
分割线用于在卡片中分隔不同的内容区块，提供清晰的视觉层次。

## Tag
```json
{ "tag": "hr" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `hr` |
| margin | 否 | String | 0 | 组件外边距 |

## 示例代码

### 基础分割线
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "上一部分内容"
        }
      },
      {
        "tag": "hr"
      },
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "下一部分内容"
        }
      }
    ]
  }
}
```

### 带间距的分割线
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "内容区块 1"
        },
        "margin": "8px"
      },
      {
        "tag": "hr",
        "margin": "16px 0"
      },
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "内容区块 2"
        },
        "margin": "8px"
      }
    ]
  }
}
```

## 使用场景
1. 分隔不同的内容区块
2. 在列表项之间创建视觉分隔
3. 区分卡片的不同功能区域
4. 在表单中标记不同的字段组

## 注意事项
1. 分割线没有可配置的颜色或样式
2. 建议配合 margin 使用以获得更好的视觉效果
3. 避免在短内容中频繁使用分割线
4. 分割线会自动适应卡片宽度
