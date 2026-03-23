# 飞书卡片 API 总览

本文档提供飞书卡片业务相关的 API 和事件列表。以下接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)。

> **注意**：消息业务也提供了一系列用于发送卡片等的 API，用于卡片类型的消息。详见 [消息卡片资源总览](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message-card/overview)。

## 应用类型说明

- **store**：商店应用
- **custom**：企业自建应用

## 卡片级别 API

| 方法 | 路径 | 权限要求 | Access Token | 商店应用 | 自建应用 |
|------|------|----------|---------|----------|----------|
| `POST` | `/open-apis/cardkit/v1/cards` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `PUT` | `/open-apis/cardkit/v1/cards/:card_id` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `PATCH` | `/open-apis/cardkit/v1/cards/:card_id/settings` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `POST` | `/open-apis/cardkit/v1/cards/:card_id/batch_update` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |

## 组件级别 API

| 方法 | 路径 | 权限要求 | Access Token | 商店应用 | 自建应用 |
|------|------|----------|---------|----------|----------|
| `POST` | `/open-apis/cardkit/v1/cards/:card_id/elements` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `PUT` | `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `PATCH` | `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `PUT` | `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id/content` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |
| `DELETE` | `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (cardkit:card:write) | `tenant_access_token` | ✓ | ✓ |

## 相关文档链接

- [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)
- [流式更新 OpenAPI 调用指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-updates-openapi-overview)
- [飞书卡片开发指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview)
- [组件总览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/component-overview)

---

*文档生成时间：2026-03-20*
