# Checkbox 复选框组件

## 组件概述
复选框组件用于在卡片中创建多项选择控件，支持单选和多选模式，适合收集用户的选择和确认。

## Tag
```json
{ "tag": "checkbox" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `checkbox` |
| element_id | 否 | String | / | 组件唯一标识 |
| margin | 否 | String | 0 | 组件外边距 |
| options | 是 | Array | / | 选项数组 |
| checked_indices | 否 | Array | [] | 默认选中项索引数组 |
| disabled | 否 | Boolean | false | 是否禁用 |

## options 数组结构
```json
{
  "tag": "checkbox_option",
  "text": {
    "tag": "plain_text",
    "content": "选项文本"
  },
  "value": "选项值"
}
```

## 示例代码

### 基础复选框
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "checkbox",
        "element_id": "check_tasks",
        "options": [
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "任务 1：需求分析"
            },
            "value": "task1"
          },
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "任务 2：设计评审"
            },
            "value": "task2"
          },
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "任务 3：开发实现"
            },
            "value": "task3"
          }
        ],
        "checked_indices": [0]
      }
    ]
  }
}
```

### 带表单的复选框
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "form",
        "elements": [
          {
            "tag": "checkbox",
            "name": "skills",
            "form_action_type": "on_change",
            "options": [
              {
                "tag": "checkbox_option",
                "text": {
                  "tag": "plain_text",
                  "content": "JavaScript"
                },
                "value": "js"
              },
              {
                "tag": "checkbox_option",
                "text": {
                  "tag": "plain_text",
                  "content": "Python"
                },
                "value": "py"
              },
              {
                "tag": "checkbox_option",
                "text": {
                  "tag": "plain_text",
                  "content": "Go"
                },
                "value": "go"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 确认清单
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "**请确认以下事项：**"
        }
      },
      {
        "tag": "checkbox",
        "element_id": "confirm_list",
        "options": [
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "✅ 我已阅读并理解任务要求"
            },
            "value": "confirm1"
          },
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "✅ 我已准备好所需资源"
            },
            "value": "confirm2"
          },
          {
            "tag": "checkbox_option",
            "text": {
              "tag": "plain_text",
              "content": "✅ 我已知晓截止时间"
            },
            "value": "confirm3"
          }
        ]
      }
    ]
  }
}
```

## 使用场景
1. 多项选择
2. 任务清单确认
3. 偏好设置
4. 权限选择

## 注意事项
1. 至少需要一个选项
2. 支持多选（默认）或单选模式
3. 可配合表单使用实现自动提交
4. 移动端会优化点击区域
