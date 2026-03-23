# 批量更新卡片

批量更新卡片内容，支持多种操作类型。

## 使用限制

- 此接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure) 或使用卡片构建工具构建的 [新版本卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/cardkit-upgraded-version-card-release-notes)
- 调用此接口时，不支持将卡片设置为独占卡片模式
- 调用接口的应用身份必须与创建目标卡片实体的应用身份一致

## 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/batch_update` |
| HTTP 方法 | `POST` |
| 限流 | [1000 次/分钟 & 50 次/秒](https://open.feishu.cn/document/ukTMukTMukTM/uUzN04SN3QjL1cDN) |
| 支持的应用类型 | 自定义应用、商店应用 |
| 必填 scopes | `cardkit:card:write`（创建和更新卡片） |

### 请求头

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | `tenant_access_token`<br>**值格式**: `"Bearer access_token"` |
| Content-Type | string | 是 | **固定值**: `"application/json; charset=utf-8"` |

### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| card_id | string | 卡片实体 ID<br>**示例值**: `"7355439197428236291"`<br>**数据验证规则**: 长度 1～20 个字符 |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 否 | 幂等 ID，可传入唯一 UUID 确保同一批操作只执行一次<br>**数据验证规则**: 长度 1～64 个字符 |
| sequence | int | 是 | 卡片操作序列号，用于保证多次更新的先后顺序<br>**注意**: 通过 Card OpenAPI 操作同一张卡片时，请确保 `sequence` 的值严格递增<br>**数据验证规则**: int32 范围内的正整数（1～2147483647）<br>**示例值**: `1712578784` |
| actions | string | 是 | 操作列表，可选值：<br>- `partial_update_setting`: 更新卡片配置，支持更新 card config 和 card_link 字段<br>- `add_elements`: 添加组件，支持 type、target_element_id、elements 字段<br>- `delete_elements`: 删除组件，支持 element_ids 字段，参数值为组件 ID 数组<br>- `partial_update_element`: 更新组件属性，支持 element_id 和 partial_element 字段<br>- `update_element`: 全量更新组件，支持 element_id 和 element 字段<br>**数据验证规则**: 长度 1～1000000 个字符 |

### 请求体示例

```json
{
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1712578784,
  "actions": "[{\"action\":\"partial_update_setting\",\"params\":{\"settings\":{\"config\":{\"streaming_mode\":true}}}},{\"action\":\"add_elements\",\"params\":{\"type\":\"insert_before\",\"target_element_id\":\"markdown_1\",\"elements\":[{\"tag\":\"markdown\",\"element_id\":\"md_1\",\"content\":\"欢迎使用 [飞书卡片构建工具](https://open.feishu.cn/cardkit?from=open_docs)。\"}]}},{\"action\":\"delete_elements\",\"params\":{\"element_ids\":[\"text_1\",\"text_2\"]}},{\"action\":\"partial_update_element\",\"params\":{\"element_id\":\"markdown_2\",\"partial_element\":{\"content\":\"详情参考飞书卡片相关文档。\"}}},{\"action\":\"update_element\",\"params\":{\"element_id\":\"markdown_3\",\"element\":{\"tag\":\"button\",\"text\":{\"tag\":\"plain_text\",\"content\":\"有帮助\"},\"size\":\"medium\",\"icon\":{\"tag\":\"standard_icon\",\"token\":\"emoji_outlined\"}}}}]"
}
```

## 响应

### 响应体参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | int | 错误码，非零表示失败 |
| msg | string | 错误描述 |
| data | - | - |

### 响应体示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

## 错误码

| HTTP 状态码 | 错误码 | 描述 | 排查建议 |
|-----------|--------|------|---------|
| 400 | 3060001 | param is invalid | 参数无效 |
| 400 | 10002 | 请求中包含无效的请求参数 | 参数错误 |
| 400 | 200740 | 卡片实体不存在 | 请检查实体 ID 是否正确 |
| 400 | 200750 | 卡片实体已过期 | 有效期为 14 天 |
| 400 | 200770 | UUID 冲突 | 请传入唯一 UUID |
| 400 | 200810 | 卡片正在交互中，无法更新 | 卡片正在进行交互 |
| 400 | 200860 | 卡片内容超限 | 请控制在 30KB 以内 |
| 400 | 300301 | 卡片组件中重复的 element_id | 组件 ID 重复 |
| 400 | 300302 | update_multi 属性为 false | 流式更新模式下必须为 true |
| 400 | 300303 | 仅支持 schema 2.0 | 仅支持 Schema v2.0 结构 |
| 400 | 200220 | 生成卡片内容失败 | 请检查卡片 JSON 格式 |
| 400 | 300305 | 卡片组件数量超过 200 | 超出组件数量限制 |
| 400 | 300307 | 卡片 DSL 为空 | 卡片 JSON 数据为空 |
| 400 | 300311 | 当前应用无权更新/使用此卡片 | 只有创建卡片实体的应用才能操作 |
| 400 | 300312 | 无法更新元素标签 | 无法更新组件的 tag 属性 |
| 400 | 300313 | 更新元素属性失败 | 更新组件属性失败 |
| 400 | 300314 | 删除元素失败 | 删除组件失败 |
| 400 | 300315 | 添加元素失败 | 添加组件失败 |
| 400 | 300317 | 操作序列号未连续递增 | sequence 值需严格递增 |
| 400 | 300121 | 替换元素失败 | 替换组件失败 |
| 400 | 300122 | 更新卡片配置失败 | 更新卡片配置失败 |

## 使用示例

```bash
curl -X POST "https://open.feishu.cn/open-apis/cardkit/v1/cards/7355439197428236291/batch_update" \
  -H "Authorization: Bearer t-7f1bcd13fc57d46bac21793a18e560" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "sequence": 1712578784,
    "actions": "[{\"action\":\"partial_update_setting\",\"params\":{\"settings\":{\"config\":{\"streaming_mode\":true}}}}]"
  }'
```

---

*文档来源：飞书开放平台官方文档*
