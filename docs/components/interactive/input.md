# Input 输入框组件

## 组件概述
输入框组件用于内容收集场景，可收集用户填写的主观内容，如原因、评价、备注等。

## Tag
```json
{
  "tag": "input"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 输入框标签，固定为 `input` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距 |
| name | 否 | String | 空 | 输入框的唯一标识符 |
| required | 否 | Boolean | false | 是否必填 |
| placeholder | 否 | text structure | / | 输入框内占位文字 |
| default_value | 否 | String | / | 预填充内容 |
| disabled | 否 | Boolean | false | 是否禁用 |
| width | 否 | String | default | 输入框宽度 |
| behaviors | 否 | Struct | / | 交互行为配置 |
| max_length | 否 | Number | 1000 | 最大文本长度 |
| input_type | 否 | String | text | 输入类型 |
| rows | 否 | Number | 5 | 默认显示行数 |
| auto_resize | 否 | Boolean | false | 是否自适应高度 |
| max_rows | 否 | Number | / | 最大显示行数 |
| show_icon | 否 | Boolean | true | 密码类型是否显示图标 |
| label | 否 | text structure | / | 文本标签 |
| label_position | 否 | String | top | 标签位置 |

## 输入类型

| 类型 | 说明 |
|------|------|
| text | 普通文本 |
| multiline_text | 多行文本，支持换行 |
| password | 密码，输入内容显示为"•" |

## 示例代码

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "form",
        "elements": [
          {
            "tag": "input",
            "element_id": "username",
            "margin": "0px 0px 0px 0px",
            "placeholder": {
              "tag": "plain_text",
              "content": "请输入"
            },
            "default_value": "",
            "width": "default",
            "label": {
              "tag": "plain_text",
              "content": "用户名："
            },
            "name": "Input_31q6mtuvdx9"
          },
          {
            "tag": "input",
            "element_id": "password",
            "input_type": "password",
            "placeholder": {
              "tag": "plain_text",
              "content": "请输入"
            },
            "label": {
              "tag": "plain_text",
              "content": "密码："
            },
            "name": "Input_5hez3q41fck"
          },
          {
            "tag": "column_set",
            "flex_mode": "none",
            "background_style": "default",
            "columns": [
              {
                "tag": "column",
                "width": "auto",
                "elements": [
                  {
                    "tag": "button",
                    "text": {
                      "tag": "plain_text",
                      "content": "提交"
                    },
                    "type": "primary",
                    "action_type": "form_submit",
                    "name": "Button_lrocopxs"
                  }
                ]
              }
            ]
          }
        ],
        "name": "Form_lrocopxr"
      }
    ]
  }
}
```

## 注意事项

1. 需与按钮组件配合使用时，需将两者都嵌入表单容器
2. 输入框组件数据在表单容器中异步提交
3. 支持配置二次确认弹窗
4. 密码类型支持显示/隐藏图标
