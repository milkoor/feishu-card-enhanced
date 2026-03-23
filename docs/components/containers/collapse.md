# Collapsible Panel 折叠面板组件

## ⚠️ 重要说明

- **正确标签**: `tag: "collapsible_panel"` (不是 `collapse`)
- **版本要求**: 需要飞书客户端 **7.20+**
- **V1 兼容**: 客户端 < 7.20 时，卡片会显示 "请升级至最新版本客户端"
- **JSON 版本**: 此组件仅支持 **JSON 2.0** 格式 (`schema: "2.0"` + `body.elements`)

## 组件概述

折叠面板用于在有限空间内展示更多内容，支持展开/收起操作，适合展示详细信息或可配置选项。

## Tag
```json
{ "tag": "collapsible_panel" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `collapsible_panel` |
| expanded | 否 | Boolean | false | 默认是否展开 (false=折叠) |
| header | 是 | Struct | / | 面板头部配置 |
| elements | 否 | Array | [] | 展开后显示的元素数组 |
| border | 否 | Struct | / | 边框样式 |
| vertical_spacing | 否 | String | 8px | 垂直间距 |
| padding | 否 | String | / | 内边距 |

## header 字段结构

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| title | 是 | Struct | 标题文本 (plain_text 或 markdown) |
| vertical_align | 否 | String | 垂直对齐 (center) |
| icon | 否 | Struct | 展开/折叠图标 |
| icon_position | 否 | String | 图标位置 (right, follow_text) |
| icon_expanded_angle | 否 | Number | 展开时图标旋转角度 (-180) |
| background_color | 否 | String | 标题背景色 |

## icon 配置

```json
{
  "tag": "standard_icon",
  "token": "down-small-ccm_outlined",
  "size": "16px 16px",
  "color": "white"
}
```

## 示例代码

### 基础折叠面板 (默认折叠)
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "collapsible_panel",
        "expanded": false,
        "header": {
          "title": { "tag": "plain_text", "content": "📋 执行日志" },
          "vertical_align": "center",
          "icon": {
            "tag": "standard_icon",
            "token": "down-small-ccm_outlined",
            "size": "16px 16px"
          },
          "icon_position": "right",
          "icon_expanded_angle": -180
        },
        "border": { "color": "grey", "corner_radius": "5px" },
        "elements": [
          { "tag": "markdown", "content": "• 第一条日志\n• 第二条日志" }
        ]
      }
    ]
  }
}
```

### 默认展开的面板
```json
{
  "tag": "collapsible_panel",
  "expanded": true,
  "header": {
    "title": { "tag": "plain_text", "content": "详细信息" },
    "vertical_align": "center",
    "icon": { "tag": "standard_icon", "token": "down-small-ccm_outlined", "size": "16px 16px" },
    "icon_position": "right",
    "icon_expanded_angle": -180
  },
  "border": { "color": "grey", "corner_radius": "5px" },
  "elements": [{ "tag": "markdown", "content": "详细内容..." }]
}
```

### 带背景色的面板
```json
{
  "tag": "collapsible_panel",
  "expanded": false,
  "header": {
    "title": { "tag": "markdown", "content": "**<font color='white'>警告信息</font>**" },
    "background_color": "red",
    "vertical_align": "center",
    "icon": { "tag": "standard_icon", "token": "down-small-ccm_outlined", "color": "white", "size": "16px 16px" },
    "icon_position": "right",
    "icon_expanded_angle": -180
  },
  "border": { "color": "red", "corner_radius": "5px" },
  "elements": [{ "tag": "markdown", "content": "⚠️ 警告内容" }]
}
```

## 注意事项

1. 仅支持 JSON 2.0 格式，V1 卡片不支持此组件
2. 需要飞书客户端 7.20+ 才能正常渲染
3. 容器组件最多支持 5 层嵌套
4. 不支持在面板内嵌套 form 组件
5. 卡片构建工具暂不支持，需通过 JSON 代码编写
