# Avatar 头像组件

## 组件概述
头像组件用于展示用户头像、组织 Logo 或其他圆形图标，支持自定义尺寸和颜色。

## Tag
```json
{ "tag": "img" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `img` |
| src | 是 | Struct | / | 图片源地址 |
| alt | 否 | Struct | / | 图片描述文本 |
| mode | 否 | String | fit_horizontal | 图片填充模式 |
| preview | 否 | Boolean | false | 是否支持点击预览 |
| margin | 否 | String | 0 | 组件外边距 |
| width | 否 | String | auto | 图片宽度 |
| height | 否 | String | auto | 图片高度 |

## 图片源地址结构
```json
{
  "tag": "image_url",
  "image_url": "https://example.com/avatar.png"
}
```

## 填充模式

| 模式 | 说明 |
|------|------|
| `fit_horizontal` | 水平适配，保持宽高比 |
| `fit_vertical` | 垂直适配，保持宽高比 |
| `crop` | 裁剪适配，填满区域 |

## 示例代码

### 基础头像
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "img",
        "src": {
          "tag": "image_url",
          "image_url": "https://example.com/avatar.png"
        },
        "alt": {
          "tag": "plain_text",
          "content": "用户头像"
        },
        "mode": "crop",
        "width": "48px",
        "height": "48px"
      }
    ]
  }
}
```

### 带边框的圆形头像
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "column_set",
        "flex_mode": "flow",
        "columns": [
          {
            "tag": "column",
            "width": "auto",
            "vertical_align": "middle",
            "elements": [
              {
                "tag": "img",
                "src": {
                  "tag": "image_url",
                  "image_url": "https://example.com/avatar.png"
                },
                "mode": "crop",
                "width": "48px",
                "height": "48px",
                "preview": true
              }
            ]
          },
          {
            "tag": "column",
            "width": "fill",
            "vertical_align": "middle",
            "elements": [
              {
                "tag": "div",
                "text": {
                  "tag": "lark_md",
                  "content": "**张三**\n产品经理"
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

### 多个头像并排
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "column_set",
        "flex_mode": "flow",
        "columns": [
          {
            "tag": "column",
            "width": "auto",
            "elements": [
              {
                "tag": "img",
                "src": {
                  "tag": "image_url",
                  "image_url": "https://example.com/user1.png"
                },
                "width": "36px",
                "height": "36px"
              }
            ]
          },
          {
            "tag": "column",
            "width": "auto",
            "elements": [
              {
                "tag": "img",
                "src": {
                  "tag": "image_url",
                  "image_url": "https://example.com/user2.png"
                },
                "width": "36px",
                "height": "36px"
              }
            ]
          },
          {
            "tag": "column",
            "width": "auto",
            "elements": [
              {
                "tag": "img",
                "src": {
                  "tag": "image_url",
                  "image_url": "https://example.com/user3.png"
                },
                "width": "36px",
                "height": "36px"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 使用场景
1. 展示用户头像
2. 显示组织 Logo
3. 项目图标
4. 产品缩略图

## 注意事项
1. 建议使用正方形图片以获得最佳圆形效果
2. 支持常见的图片格式：JPG, PNG, GIF, WebP
3. 图片大小建议控制在合理范围（如 100KB 以内）
4. 移动端和 PC 端都支持点击预览
