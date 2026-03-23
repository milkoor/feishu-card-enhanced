# 其他相关 API

包含消息卡片相关 API 和其他辅助 API。

## 消息卡片概述

飞书卡片可以将结构化内容以卡片形式嵌入到聊天消息、群置顶消息、链接预览等飞书协作场景中，提升信息传递效率。

消息服务提供了一系列用于卡片类型消息的 API，可用于实现以下功能：

- [更新应用发送的消息卡片](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/patch)
- [延时更新消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uMDO1YjLzgTN24yM4UjN)
- [发送仅特定人可见的消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uETOyYjLxkjM24SM5IjN)
- [删除仅特定人可见的消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uITOyYjLykjM24iM5IjN)

## 卡片 JSON 结构示例

```json
{
  "config": {
    "wide_screen_mode": true
  },
  "header": {
    "title": {
      "tag": "plain_text",
      "content": "有一条请假申请需要你的审批"
    }
  },
  "elements": [
    {
      "tag": "div",
      "fields": [
        {
          "is_short": true,
          "text": {
            "tag": "lark_md",
            "content": "**申请人**\n王小李"
          }
        },
        {
          "is_short": true,
          "text": {
            "tag": "lark_md",
            "content": "**请假类型:**\n年假"
          }
        },
        {
          "is_short": false,
          "text": {
            "tag": "lark_md",
            "content": ""
          }
        },
        {
          "is_short": false,
          "text": {
            "tag": "lark_md",
            "content": "**时长:**\n2020-4-8 至 2020-4-10（共 3 天）"
          }
        },
        {
          "is_short": false,
          "text": {
            "tag": "lark_md",
            "content": ""
          }
        },
        {
          "is_short": true,
          "text": {
            "tag": "lark_md",
            "content": "**备注**\n回老家有急事"
          }
        }
      ]
    },
    {
      "tag": "hr"
    },
    {
      "tag": "action",
      "layout": "bisected",
      "actions": [
        {
          "tag": "button",
          "text": {
            "tag": "plain_text",
            "content": "批准"
          },
          "type": "primary",
          "value": {
            "chosen": "approve"
          }
        },
        {
          "tag": "button",
          "text": {
            "tag": "plain_text",
            "content": "拒绝"
          },
          "type": "primary",
          "value": {
            "chosen": "decline"
          }
        }
      ]
    }
  ]
}
```

## 相关 API 链接

### 消息卡片 API

| API | 说明 |
|-----|------|
| [更新消息卡片](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/patch) | 更新应用发送的消息卡片 |
| [延时更新消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uMDO1YjLzgTN24yM4UjN) | 延时更新消息卡片 |
| [发送私密消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uETOyYjLxkjM24SM5IjN) | 发送仅特定人可见的消息卡片 |
| [删除私密消息卡片](https://open.feishu.cn/document/ukTMukTMukTM/uITOyYjLykjM24iM5IjN) | 删除仅特定人可见的消息卡片 |

### 卡片开发相关

| API | 说明 |
|-----|------|
| [发送飞书卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/send-feishu-card) | 学习如何发送卡片消息 |
| [更新飞书卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/update-feishu-card) | 学习如何更新卡片消息 |
| [卡片 JSON 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-structure) | 卡片结构字段说明 |
| [流式更新 OpenAPI 概览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-updates-openapi-overview) | 流式更新调用指南 |

## 通用错误码

以下错误码在卡片相关 API 中通用：

| HTTP 状态码 | 错误码 | 描述 | 排查建议 |
|-----------|--------|------|---------|
| 400 | 10002 | 请求中包含无效的请求参数 | 参数错误。请根据接口返回的错误信息检查输入参数，并参考文档 |
| 400 | 200740 | 卡片实体不存在 | 卡片实体不存在，请检查实体 ID 是否正确 |
| 400 | 200750 | 卡片实体已过期 | 卡片实体已过期，有效期为 14 天 |
| 400 | 200770 | UUID 冲突 | UUID 冲突，请传入唯一 UUID |
| 400 | 200810 | 卡片正在交互中，无法更新 | 卡片正在进行交互，无法更新 |
| 400 | 200860 | 卡片内容超限 | 卡片大小超出限制，建议控制在 30KB 以内 |
| 400 | 300301 | 卡片组件中重复的 element_id | 卡片内部组件的 ID 重复，请检查修改 |
| 400 | 300302 | update_multi 属性为 false | 流式更新模式下，卡片全局属性 update_multi 必须设置为 true |
| 400 | 300303 | 仅支持 schema 2.0 | 此接口仅支持 Schema v2.0 结构 |
| 400 | 200220 | 生成卡片内容失败 | 生成卡片内容失败，请检查卡片 JSON 格式是否有误 |
| 400 | 300305 | 卡片组件数量超过 200 | 超出卡片组件数量限制 |
| 400 | 300307 | 卡片 DSL 为空 | 卡片 JSON 数据为空，请检查修改 |
| 400 | 300311 | 当前应用无权更新/使用此卡片 | 只有创建卡片实体的应用才能调用相关 OpenAPI 发送和操作卡片 |
| 400 | 300317 | 操作序列号未连续递增 | sequence 值需严格递增 |

## 使用示例

### 发送消息卡片

```bash
# 发送卡片消息到群聊
curl -X POST "https://open.feishu.cn/open-apis/im/v1/messages" \
  -H "Authorization: Bearer t-7f1bcd13fc57d46bac21793a18e560" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "receive_id": "oc_xxx",
    "msg_type": "interactive",
    "content": "{\"config\":{\"wide_screen_mode\":true},\"header\":{\"title\":{\"tag\":\"plain_text\",\"content\":\"测试卡片\"}},\"elements\":[{\"tag\":\"markdown\",\"content\":\"你好世界\"}]}"
  }'
```

### 更新消息卡片

```bash
# 更新已发送的卡片消息
curl -X PUT "https://open.feishu.cn/open-apis/im/v1/messages/:message_id" \
  -H "Authorization: Bearer t-7f1bcd13fc57d46bac21793a18e560" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "content": "{\"config\":{\"wide_screen_mode\":true},\"header\":{\"title\":{\"tag\":\"plain_text\",\"content\":\"更新后的卡片\"}},\"elements\":[{\"tag\":\"markdown\",\"content\":\"更新内容\"}]}"
  }'
```

---

*文档来源：飞书开放平台官方文档*
*最后更新：2026-03-20*
