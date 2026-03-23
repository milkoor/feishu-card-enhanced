# Select 选择器组件

## 组件概述
选择器组件用于在卡片中创建下拉选择框，支持单选和多选模式，适合在有限空间内提供多个选项。

## Tag
```json
{ "tag": "select" }
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `select` |
| element_id | 否 | String | / | 组件唯一标识 |
| margin | 否 | String | 0 | 组件外边距 |
| options | 是 | Array | / | 选项数组 |
| initial_index | 否 | Number | 0 | 默认选中项索引 |
| disabled | 否 | Boolean | false | 是否禁用 |

## options 数组结构
```json
{
  "tag": "option",
  "text": {
    "tag": "plain_text",
    "content": "选项文本"
  },
  "value": "选项值"
}
```

## 示例代码

### 基础选择器
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "select",
        "element_id": "select_status",
        "options": [
          {
            "tag": "option",
            "text": {
              "tag": "plain_text",
              "content": "待处理"
            },
            "value": "pending"
          },
          {
            "tag": "option",
            "text": {
              "tag": "plain_text",
              "content": "进行中"
            },
            "value": "in_progress"
          },
          {
            "tag": "option",
            "text": {
              "tag": "plain_text",
              "content": "已完成"
            },
            "value": "completed"
          }
        ],
        "initial_index": 0
      }
    ]
  }
}
```

### 带表单动作的选择器
```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "form",
        "elements": [
          {
            "tag": "select",
            "name": "status",
            "form_action_type": "on_change",
            "options": [
              {
                "tag": "option",
                "text": {
                  "tag": "plain_text",
                  "content": "选项 1"
                },
                "value": "option1"
              },
              {
                "tag": "option",
                "text": {
                  "tag": "plain_text",
                  "content": "选项 2"
                },
                "value": "option2"
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
1. 状态选择（待处理/进行中/已完成）
2. 优先级选择（高/中/低）
3. 分类筛选
4. 参数配置

## 注意事项
1. 至少需要一个选项
2. 支持动态添加/删除选项
3. 可配合表单使用实现自动提交
4. 移动端会弹出选择器面板
