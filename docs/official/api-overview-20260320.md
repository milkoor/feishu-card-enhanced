# 飞书卡片 API 资源总览

> 来源：飞书开放平台官方文档  
> 更新时间：2026-03-20  
> 状态：✅ 已下载  
> 原始链接：https://open.feishu.cn/document/cardkit-v1/feishu-card-resource-overview

---

## 📋 概述

飞书卡片是应用的一种能力，包括构建卡片内容所需的组件和发送卡片所需的能力，并提供 [可视化构建工具](https://open.feishu.cn/cardkit?from=open_docs_overview)。飞书开放平台为飞书卡片提供了一系列 OpenAPI，使用这些 OpenAPI 可以在卡片和组件级别部分或流式更新卡片。

## 🎯 典型案例

开放平台提供了包含飞书信片的案例，详情请参考：
- [智能审批管理，助力提升企业效率](https://open.feishu.cn/solutions/detail/automation)
- [智能派发运维工单，信息流转顺畅又准确](https://open.feishu.cn/solutions/detail/ticke)
- [项目管理遇上飞书，协作沉淀更便捷](https://open.feishu.cn/solutions/detail/project)
- [告别手工，基于飞书机器人实现自动群管理](https://open.feishu.cn/solutions/detail/group)
- [企业系统深度融合，飞书审批让流程更轻松](https://open.feishu.cn/solutions/detail/approval)

## 🔗 接入流程

卡片 API 的基本接入流程如下图所示。详细的 API 接入流程请参考 [流程概览](https://open.feishu.cn/document/ukTMukTMukTM/uITNz4iM1MjLyUzM)。

## 📚 开发指南

- 参考 [流式更新 OpenAPI 调用指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-updates-openapi-overview) 学习如何调用卡片接口。
- 访问 [飞书卡片开发指南文档](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview) 学习如何构建、发送和更新卡片。

## 🛠️ 资源介绍

在飞书卡片 OpenAPI 中，接口是围绕卡片和组件资源打开的。

| 资源 | 描述 |
|------|------|
| **卡片 (Card)** | 飞书卡片可以将结构化内容以卡片形式嵌入到飞书聊天消息、群置顶消息、链接预览等飞书协作场景中，提高信息传递效率。更多详情请参考 [飞书卡片概览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview)。通过卡片实体 API，可以从卡片维度创建和更新卡片。 |
| **组件 (Component)** | 飞书卡片中的组件可以分为容器、展示和交互组件。更多详情请参考 [组件概览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/component-overview)。通过组件 API，可以在卡片中添加和修改组件。 |

---

## 📡 方法列表

以下是卡片业务的 API 和事件列表。以下接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)。

> **注意**：消息业务也提供了一系列用于发送卡片等的 API，用于卡片类型的消息。详见 [消息卡片资源总览](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message-card/overview)。
>
> 在下表中，**store** 指商店应用，**custom** 指企业自建应用。关于应用类型的描述，请参考 [应用类型介绍](https://open.feishu.cn/document/home/app-types-introduction/overview)。

### 卡片级别 API

| 方法 (API) | 权限要求（满足任一即可） | Access Token | 商店应用 | 自建应用 |
|-----------|------------------------|--------------|---------|---------|
| `POST` [创建卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/create) <br> `/open-apis/cardkit/v1/cards` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `PUT` [全量更新卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/update) <br> `/open-apis/cardkit/v1/cards/:card_id` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `PATCH` [更新卡片设置](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/settings) <br> `/open-apis/cardkit/v1/cards/:card_id/settings` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `POST` [批量更新卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/batch_update) <br> `/open-apis/cardkit/v1/cards/:card_id/batch_update` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |

### 组件级别 API

| 方法 (API) | 权限要求（满足任一即可） | Access Token | 商店应用 | 自建应用 |
|-----------|------------------------|--------------|---------|---------|
| `POST` [添加组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/create) <br> `/open-apis/cardkit/v1/cards/:card_id/elements` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `PUT` [更新组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/update) <br> `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `PATCH` [更新组件属性](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/patch) <br> `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `PUT` [流式更新文本](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/content) <br> `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id/content` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |
| `DELETE` [删除组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/delete) <br> `/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` | 创建和更新卡片 (`cardkit:card:write`) | `tenant_access_token` | ✓ | ✓ |

---

## 📝 权限说明

### 权限要求
所有卡片和组件级别的 API 都需要满足以下权限之一：
- **创建和更新卡片** (`cardkit:card:write`)

### Access Token
- 所有接口都使用 `tenant_access_token`

### 应用类型支持
- ✅ **商店应用 (Store)** - 所有接口都支持
- ✅ **自建应用 (Custom)** - 所有接口都支持

---

## 🔗 相关链接

### 开发指南
- [飞书卡片开发指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview)
- [流式更新 OpenAPI 调用指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/streaming-updates-openapi-overview)
- [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)
- [组件概览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/component-overview)

### API 文档
- [创建卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/create)
- [全量更新卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/update)
- [更新卡片设置](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/settings)
- [批量更新卡片实体](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card/batch_update)
- [添加组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/create)
- [更新组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/update)
- [更新组件属性](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/patch)
- [流式更新文本](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/content)
- [删除组件](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/cardkit-v1/card-element/delete)

### 其他资源
- [消息卡片资源总览](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message-card/overview)
- [应用类型介绍](https://open.feishu.cn/document/home/app-types-introduction/overview)
- [流程概览](https://open.feishu.cn/document/ukTMukTMukTM/uITNz4iM1MjLyUzM)

---

*下载时间：2026-03-20 08:29*
