# Link 链接组件

## 组件概述
链接组件用于在卡片中创建可点击的超链接，支持跳转到网页、飞书文档、工作台等。

## Tag
```json
{ "tag": "a" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `a` |
| text | 是 | Struct | / | 链接显示的文本 |
| href | 是 | String | / | 链接地址 |
| margin | 否 | String | 0 | 组件外边距 |

## 支持的链接类型

### 网页链接
- 标准的 HTTP/HTTPS 网址
- 例如：`https://example.com`

### 飞书文档
- 飞书云文档链接
- 例如：`https://xxx.feishu.cn/docx/xxx`

### 飞书多维表格
- 例如：`https://xxx.feishu.cn/bitable/xxx`

### 飞书工作簿
- 例如：`https://xxx.feishu.cn/sheets/xxx`

## 示例代码

### 基础链接
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "a",
        "text": {
          "tag": "plain_text",
          "content": "访问飞书开放平台"
        },
        "href": "https://open.feishu.cn/document"
      }
    ]
  }
}
```

### 带样式的链接
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "更多信息请查看 [飞书开放平台](https://open.feishu.cn/document)"
        }
      }
    ]
  }
}
```

### 多个链接
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "a",
        "text": {
          "tag": "plain_text",
          "content": "📖 文档中心"
        },
        "href": "https://open.feishu.cn/document"
      },
      {
        "tag": "a",
        "text": {
          "tag": "plain_text",
          "content": "💬 开发者社区"
        },
        "href": "https://open.feishu.cn/community"
      }
    ]
  }
}
```

## 使用场景
1. 跳转到外部网站
2. 打开飞书文档
3. 访问相关资源
4. 提供参考链接

## 注意事项
1. 链接会在点击后跳转到新页面
2. 支持 Markdown 格式的链接语法
3. 确保链接地址的准确性和安全性
4. 移动端和 PC 端都支持点击跳转
