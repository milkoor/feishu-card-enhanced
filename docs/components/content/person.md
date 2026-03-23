# Person 人员组件

> 来源：飞书开放平台官方文档  
> 下载时间：2026-03-20  
> 状态：✅ 已下载

## 组件概述

人员组件支持显示用户的姓名和头像。你可以通过传入人员的 `open_id`、`user_id` 或 `union_id` 来使用此组件。

**注意**：如果使用指定应用发送包含人员组件的卡片，必须确保该应用有权限访问用户 ID。否则，卡片上的人员组件将不显示任何人员信息。

## JSON 结构

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "person",
        "element_id": "custom_id",
        "margin": "0px 0px 0px 0px",
        "size": "extra_small",
        "user_id": "ou_4a136bca010747fc3bd7b6f8f4cabcef",
        "show_avatar": true,
        "show_name": false,
        "style": "normal"
      }
    ]
  }
}
```

## 字段说明

| 字段 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| tag | 是 | String | person | 组件标签，固定为 `person` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符。JSON 2.0 新增属性 |
| margin | 否 | String | 0 | 组件外边距，范围 [-99,99]px |
| size | 否 | String | medium | 人员头像大小：`extra_small`、`small`、`medium`、`large` |
| show_avatar | 否 | Boolean | true | 是否显示用户头像 |
| show_name | 否 | Boolean | false | 是否显示用户姓名 |
| style | 否 | String | normal | 人员组件显示样式：`normal`（默认）、`capsule`（胶囊样式） |
| user_id | 是 | String | 空 | 人员 ID，可是 Open ID、Union ID 或 User ID |

## 示例代码

```json
{
  "schema": "2.0",
  "header": {
    "template": "blue",
    "title": {
      "content": "人员示例",
      "tag": "plain_text"
    }
  },
  "body": {
    "elements": [
      {
        "tag": "markdown",
        "content": "**extra_small 尺寸，默认样式**"
      },
      {
        "tag": "person",
        "size": "extra_small",
        "user_id": "ou_48d0958ee4b2ab3eaf0b5f6c968abcef",
        "show_avatar": true,
        "show_name": true,
        "style": "normal"
      },
      {
        "tag": "markdown",
        "content": "**small 尺寸，胶囊样式**"
      },
      {
        "tag": "person",
        "size": "small",
        "user_id": "ou_48d0958ee4b2ab3eaf0b5f6c968abcef",
        "show_avatar": true,
        "show_name": true,
        "style": "capsule"
      }
    ]
  }
}
```

## 使用场景

1. 任务负责人展示
2. 团队成员介绍
3. 联系人列表
4. 审批人流

---

*下载时间：2026-03-20*
