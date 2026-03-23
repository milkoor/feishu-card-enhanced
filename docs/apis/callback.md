# 卡片组件操作

包含添加、更新、删除卡片组件的相关 API。

## 添加组件

在卡片中插入组件。

### 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/elements` |
| HTTP 方法 | `POST` |
| 必填 scopes | `cardkit:card:write` |

### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| card_id | string | 卡片实体 ID<br>**数据验证规则**: 长度 1～20 个字符 |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 添加组件的方式<br>**可选值**: `insert_before`（插入到目标组件前）、`insert_after`（插入到目标组件后）、`append`（添加到卡片或容器组件末尾）<br>**示例值**: `"insert_before"` |
| target_element_id | string | 否 | 目标组件 ID。当 type 为 insert_before、insert_after 时，为目标组件用于定位。当 type 为 append 时，此字段仅支持容器类组件<br>**数据验证规则**: 长度 0～20 个字符 |
| uuid | string | 否 | 幂等 ID<br>**数据验证规则**: 长度 1～64 个字符 |
| sequence | int | 是 | 操作序列号，需严格递增<br>**数据验证规则**: int32 范围内的正整数（1～2147483647）<br>**示例值**: `1` |
| elements | string | 是 | 组件列表<br>**示例值**: `"[{\"tag\":\"markdown\",\"id\":\"md_1\",\"content\":\"示例文本\"}]"`<br>**数据验证规则**: 长度 1～1000000 个字符 |

### 请求体示例

```json
{
  "type": "insert_before",
  "target_element_id": "elem_63529372",
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1,
  "elements": "[{\"tag\":\"markdown\",\"id\":\"md_1\",\"content\":\"示例文本\"}]"
}
```

### 响应

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

### 错误码

| HTTP 状态码 | 错误码 | 描述 |
|-----------|--------|------|
| 400 | 10002 | 参数错误 |
| 400 | 200740 | 卡片实体不存在 |
| 400 | 200750 | 卡片实体已过期 |
| 400 | 200770 | UUID 冲突 |
| 400 | 200810 | 卡片正在交互中 |
| 400 | 200510 | 卡片流式超时 |
| 400 | 300301 | 组件 ID 重复 |
| 400 | 300302 | update_multi 为 false |
| 400 | 200220 | 生成卡片内容失败 |
| 400 | 300305 | 组件数量超过 200 |
| 400 | 300307 | 卡片 DSL 为空 |
| 400 | 300311 | 无权操作此卡片 |
| 400 | 300315 | 添加组件失败 |
| 400 | 300317 | 序列号未递增 |
| 400 | 300120 | 服务器内部错误 |

## 更新组件（全量）

全量更新组件内容。

### 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` |
| HTTP 方法 | `PUT` |
| 必填 scopes | `cardkit:card:write` |

### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| card_id | string | 卡片实体 ID |
| element_id | string | 组件 ID<br>**数据验证规则**: 长度 1～20 个字符 |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 否 | 幂等 ID |
| element | string | 是 | 新组件内容<br>**数据验证规则**: 长度 1～1000000 个字符 |
| sequence | int | 是 | 操作序列号 |

### 请求体示例

```json
{
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "element": "{\"tag\":\"markdown\",\"id\":\"md_1\",\"content\":\"普通文本\"}",
  "sequence": 1
}
```

## 更新组件属性（部分）

部分更新组件属性，不支持修改 tag 属性。

### 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` |
| HTTP 方法 | `PATCH` |
| 必填 scopes | `cardkit:card:write` |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| partial_element | string | 是 | 要更改的组件部分配置内容<br>**数据验证规则**: 长度 1～1000000 个字符 |
| uuid | string | 否 | 幂等 ID |
| sequence | int | 是 | 操作序列号 |

### 请求体示例

```json
{
  "partial_element": "{\"content\":\"更新后的文本\"}",
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1
}
```

## 流式更新文本

向卡片中的纯文本元素（tag 为 `plain_text`）或富文本组件（tag 为 `markdown`）传入完整文本内容，实现"打字机"效果。

### 前提条件

调用此接口前，请确保卡片的流式更新模式已启用：
- 在卡片 JSON 中，设置 `streaming_mode` 为 `true`

### 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/elements/:element_id/content` |
| HTTP 方法 | `PUT` |
| 必填 scopes | `cardkit:card:write` |

### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| card_id | string | 卡片实体 ID |
| element_id | string | 纯文本元素或富文本组件的 ID<br>**注意**: 对于卡片构建工具中的卡片，仅富文本组件的组件 ID 支持此处 |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 否 | 幂等 ID |
| content | string | 是 | 更新的文本内容<br>**注意**: 如果内容包含代码块，需要移除代码块前后的空格<br>**数据验证规则**: 长度 1～100000 个字符 |
| sequence | int | 是 | 操作序列号 |

### 请求体示例

```json
{
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "content": "updated text",
  "sequence": 1
}
```

### 错误码（特有）

| HTTP 状态码 | 错误码 | 描述 |
|-----------|--------|------|
| 400 | 200850 | 卡片流式超时 |
| 400 | 300309 | 卡片流式已关闭 |
| 400 | 300310 | 仅支持更新文本 |

## 删除组件

删除指定组件，删除容器类组件时，嵌入在容器中的组件会一起删除。

### 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/elements/:element_id` |
| HTTP 方法 | `DELETE` |
| 必填 scopes | `cardkit:card:write` |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 否 | 幂等 ID |
| sequence | int | 是 | 操作序列号 |

### 请求体示例

```json
{
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1
}
```

---

*文档来源：飞书开放平台官方文档*
