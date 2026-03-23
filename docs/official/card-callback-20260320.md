# 飞书卡片回调交互通信

> 来源：飞书开放平台官方文档  
> 更新时间：2026-03-20  
> 状态：✅ 已下载  
> 原始链接：https://open.feishu.cn/document/feishu-cards/card-callback-communication

---

## 📋 概述

**卡片回调交互**适用于 Lark（飞书）卡片上的**请求回调**组件。当终端用户点击 Lark 卡片上的回调交互组件时，您开发者后台中注册的回调请求地址将会收到**卡片回调交互**。此回调包含用户与卡片交互的信息。

当您的业务服务器收到回调请求后，必须在 3 秒内响应，声明弹出 Toast 通知、更新卡片或保持原内容不变等响应。详情请参考 [处理卡片回调](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/handle-card-callbacks)。

**注意**：
- 本文档提供新版本卡片回调的结构和响应示例。开放平台 SDK 支持新版卡片回调。
- 关于旧版卡片回调的 SDK 调用信息，请参考 [卡片回调结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/configuring-card-interactions#5746ae32)。

---

## 🔔 回调信息

### 基本信息

| 项目 | 值 |
|------|-----|
| 回调类型 | `card.action.trigger` |
| 支持的应用类型 | 自定义应用、商店应用 |
| 权限要求 | 无 |
| 字段权限要求 | **注意**：事件结构包含敏感字段 `user_id`，仅在应用启用"获取用户 ID"权限时返回。<br>获取用户 ID (`contact:user.employee_id:readonly`) |
| 投递方式 | [Webhook](https://open.feishu.cn/document/ukTMukTMukTM/uUTNz4SN1MjL1UzM) |

---

## 📦 回调结构

### 字段说明

| 字段 | 数据类型 | 描述 |
|------|----------|------|
| `schema` | string | 回调版本。固定值 `2.0`，最新版回调。旧版回调信息参考 [旧消息卡片回调交互](https://open.feishu.cn/document/ukTMukTMukTM/uYzM3QjL2MzN04iNzcDN/configuring-card-callbacks/card-callback-structure)。 |
| `header` | object | 回调基本信息。 |
| `event_id` | string | 回调的唯一标识符。 |
| `token` | string | 应用的 Verification Token。 |
| `create_time` | string | 回调发送时间，与事件发生时间接近。微秒。 |
| `event_type` | string | 回调类型。在卡片交互场景中固定为 `"card.action.trigger"`。 |
| `tenant_key` | string | 应用所属租户的租户 key，即租户的唯一标识。 |
| `app_id` | string | 应用的 App ID。 |
| `event` | object | 回调的详细信息。 |
| `operator` | object | 回调发起者的信息。 |
| `tenant_key` | string | 回调发起者所属租户的租户 key。 |
| `user_id` | string | 回调发起者的用户 ID。关于不同用户 ID 的信息，参考 [用户身份概览](https://open.feishu.cn/document/home/user-identity-introduction/introduction)。 |
| `union_id` | string | 回调发起者的 Union ID。 |
| `open_id` | string | 回调发起者的 Open ID。 |
| `token` | string | 用于 [更新卡片](https://open.feishu.cn/document/ukTMukTMukTM/uMDO1YjLzgTN24yM4UjN) 的凭证，有效期 30 分钟，最多可更新 2 次。 |
| `action` | object | 交互信息。 |
| `value` | object/string | 开发者自定义的、绑定在交互组件上的数据，对应组件中的 value 属性。数据类型可以是 string 或 object。 |
| `tag` | string | 交互组件的标签。 |
| `timezone` | string | 用户当前所在时区。当用户操作日期选择器、时间选择器或日期时间选择器时返回。 |
| `name` | string | 组件的自定义唯一标识符，用于标识嵌入表单容器中的特定组件。 |
| `form_value` | object | 用户在表单容器内提交的数据。示例值：<br>```JSON<br>{<br>"field name 1": [<br>"selectDemo1",<br>"selectDemo2"<br>],<br>"field name 2": "value 2",<br>"field name 3": "value 3"<br>}<br>``` |
| `input_value` | string | 用户在未嵌入表单容器的输入框组件中提交的数据。 |
| `option` | string | 当用户从未嵌入表单容器的折叠按钮组、下拉选择或人员选择组件中选择选项时，组件返回的选项回调值。 |
| `options` | string[] | 当用户为下拉选择 - 多选组件和人员选择 - 多选组件类型的组件选择选项时，组件返回的选项回调值。 |
| `host` | string | 卡片展示场景。 |
| `delivery_type` | string | 卡片分发类型，固定值为 `url_preview`，表示链接预览卡片。此字段仅适用于链接预览卡片。 |
| `context` | object | 展示场景的上下文。 |
| `url` | string | 链接地址（适用于链接预览场景）。 |
| `preview_token` | string | 链接的预览令牌（适用于链接预览场景）。 |
| `open_message_id` | string | 消息 ID。 |
| `open_chat_id` | string | 聊天 ID。 |

### 回调结构示例

```json
{
  "schema": "2.0",
  "header": {
    "event_id": "f7984f25108f8137722bb63c*****",
    "token": "066zT6pS4QCbgj5Do145GfDbbag*****",
    "create_time": "1603977298000000",
    "event_type": "card.action.trigger",
    "tenant_key": "2df73991750*****",
    "app_id": "cli_a5fb0ae6a4******"
  },
  "event": {
    "operator": {
      "tenant_key": "2df73991750*****",
      "user_id": "867*****",
      "open_id": "ou_3c14f3a59eaf2825dbe25359f15*****",
      "union_id": "on_cad4860e7af114fb4ff6c5d496d*****"
    },
    "token": "c-295ee57216a5dc9de90fefd0aadb4b1d7d******",
    "action": {
      "value": {
        "key": "value"
      },
      "tag": "button",
      "timezone": "Asia/Shanghai",
      "form_value": {
        "field name1": [
          "selectDemo1",
          "selectDemo2"
        ],
        "field name2": "value2",
        "DatePicker_bpqdq5puvn4": "2024-04-01 +0800",
        "DateTimePicker_ihz2d7a74i": "2024-04-29 07:07 +0800",
        "Input_lf4fmxwfrd9": "1234",
        "PersonSelect_2ejys7ype7m": "ou_3c14f3a59eaf2825dbe25359f1595b00",
        "Select_a2d5b7l3zd": "1",
        "TimePicker_7ecsf6xkqsq": "00:00 +0800"
      },
      "name": "Button_lvkepfu3"
    },
    "host": "im_message",
    "delivery_type": "url_preview",
    "context": {
      "url": "xxx",
      "preview_token": "xxx",
      "open_message_id": "om_574d639e4a44e4dd646eaf628e2*****",
      "open_chat_id": "oc_e4d2605ca917e695f54f11aaf56*****"
    }
  }
}
```

---

## ✅ 响应结构

当您的业务服务器收到回调请求后，必须在 3 秒内响应，通过 Toast 通知、卡片更新或保持原内容不变来声明响应。

**注意**：业务服务器不得使用重定向状态码（`HTTP 3xx`）响应卡片的回调请求，否则会导致用户侧出现交互请求错误。

### 字段说明

| 字段 | 数据类型 | 必填 | 描述 |
|------|----------|------|------|
| `toast` | object | 否 | 客户端的 Toast 弹窗提示。 |
| `type` | string | 否 | 弹窗提示类型。可选值包括：`info`、`success`、`error`、`warning`。 |
| `content` | string | 否 | 提示文字。 |
| `i18n` | object | 否 | 多语言提示文字。 |
| `card` | object | 否 | 卡片数据。 |
| `type` | string | 是 | 卡片类型。可选值：<br>- `template`：使用构建工具构建的卡片模板<br>- `raw`：使用 JSON 构建的卡片 |
| `data` | object | 是 | 卡片的数据。根据卡片类型不同，所需字段也不同。 |

### 卡片类型说明

#### raw 类型
当 `card.type` 字段值为 `raw` 时，`card.data` 中必须包含卡片 JSON 数据。参考 [卡片 JSON 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-structure) 按要求传入数据。

- 如果发送卡片时卡片 JSON 结构是 1.0 版本，则需要传入卡片 JSON 1.0 数据。
- 如果发送卡片时卡片 JSON 结构是 2.0 版本，则需要传入卡片 JSON 2.0 数据。

#### template 类型
当 `card.type` 字段值为 `template` 时，`card.data` 中可以传入的字段如下：

| 字段 | 数据类型 | 必填 | 描述 |
|------|----------|------|------|
| `template_id` | string | 是 | 卡片模板 ID，即卡片 ID。通过卡片构建工具获取。 |
| `template_variable` | object | 否 | 卡片模板的变量。格式为 `{key:value}`。 |
| `template_version_name` | string | 否 | 卡片模板的版本。通过卡片构建工具获取。 |

---

## 📝 响应体示例

### raw 类型示例

```json
{
  "toast": {
    "type": "info",
    "content": "卡片交互成功",
    "i18n": {
      "zh_cn": "卡片交互成功",
      "en_us": "card action success"
    }
  },
  "card": {
    "type": "raw",
    "data": {
      "schema": "2.0",
      "config": {
        "update_multi": true,
        "style": {
          "text_size": {
            "normal_v2": {
              "default": "normal",
              "pc": "normal",
              "mobile": "heading"
            }
          }
        }
      },
      "body": {
        "direction": "vertical",
        "padding": "12px 12px 12px 12px",
        "elements": [
          {
            "tag": "div",
            "text": {
              "tag": "plain_text",
              "content": "示例文本",
              "text_size": "normal_v2",
              "text_align": "left",
              "text_color": "default"
            },
            "margin": "0px 0px 0px 0px"
          }
        ]
      },
      "header": {
        "title": {
          "tag": "plain_text",
          "content": "示例标题"
        },
        "subtitle": {
          "tag": "plain_text",
          "content": "示例文本"
        },
        "template": "blue",
        "padding": "12px 12px 12px 12px"
      }
    }
  }
}
```

### template 类型示例

```json
{
  "toast": {
    "type": "info",
    "content": "卡片交互成功",
    "i18n": {
      "zh_cn": "卡片交互成功",
      "en_us": "card action success"
    }
  },
  "card": {
    "type": "template",
    "data": {
      "template_id": "AAqi6xJ8rabcd",
      "template_version_name": "1.0.0",
      "template_variable": {
        "open_id": "ou_d506829e8b6a17607e56bcd6b1aabcef"
      }
    }
  }
}
```

---

## ❌ 错误码

在飞书客户端执行卡片交互时，如果出现交互错误，会返回对应的错误码。

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 200340 | 应用未配置飞书卡片回调地址或配置的请求地址无效。 | 1. 前往 [开发者后台](https://open.feishu.cn/app)，点击目标应用，选择 **开发配置** > **事件与回调**。<br>2. 在 **事件与回调** 页面的 **回调配置** 标签下，填写正确有效的请求地址并保存。<br>3. 在 **订阅的回调** 部分，确保已添加卡片交互回调。 |
| 200341 | 请求的卡片回调服务未在规定时间内响应飞书卡片服务器。 | 请确保配置的回调地址能在 3 秒内响应卡片回调请求。 |
| 200342 | 飞书卡片服务器无法与卡片回调地址建立 TCP 连接。 | 请检查并确保配置的回调地址可访问。 |
| 200343 | 飞书卡片服务器解析卡片回调地址的 DNS 失败。 | 请检查并确保配置的回调地址域名正确。 |
| 200080 | 飞书卡片服务器请求卡片回调地址时出错。 | 请联系 [技术支持](https://applink.feishu.cn/TLJpeNdW) 协助处理。 |
| 200671 | 请求的卡片回调服务返回了非 `HTTP 200` 状态码，导致卡片交互失败。 | 请检查并确保接口代码逻辑正常，不返回异常状态码。 |
| 200672 | 请求的卡片回调服务返回了不正确的响应体格式。 | 检查响应回调结构是否正确。 |
| 200673 | 请求的卡片回调服务返回了不正确的卡片。 | 检查响应回调结构中 `card` 部分的结构是否正确。 |
| 200830 | JSON 2.0 结构卡片无法更新为 JSON 1.0 结构卡片。 | 如果交互前的卡片结构是 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)，交互后的卡片结构必须仍是 2.0 结构。 |
| 200530 | 表单容器内交互组件的 `name` 属性（表单项标识符）为空。 | `name` 是组件在表单容器内的唯一标识符，不能为空或重复。 |
| 300000 | 内部服务错误。 | 请联系 [技术支持](https://applink.feishu.cn/TLJpeNdW) 协助处理。 |

---

## 🔗 相关链接

### 开发指南
- [处理卡片回调](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/handle-card-callbacks)
- [配置卡片交互](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/configuring-card-interactions)
- [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)

### API 文档
- [更新卡片](https://open.feishu.cn/document/ukTMukTMukTM/uMDO1YjLzgTN24yM4UjN)
- [发送飞书卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/send-feishu-card)
- [配置卡片变量](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/configure-card-variables)
- [预览和发布卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/preview-and-publish-cards)

---

*下载时间：2026-03-20 08:32*
