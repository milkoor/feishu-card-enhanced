# 更新卡片配置

更新给定卡片实体的配置，支持更新 `config` 和 `card_link` 字段。

## 使用限制

- 此接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure) 或使用卡片构建工具构建的 [新版本卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/cardkit-upgraded-version-card-release-notes)
- 调用此接口时，不支持将卡片设置为独占卡片模式
- 调用接口的应用身份必须与创建目标卡片实体的应用身份一致

## 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards/:card_id/settings` |
| HTTP 方法 | `PATCH` |
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
| card_id | string | 卡片实体 ID<br>**示例值**: `"7355372766134157313"`<br>**数据验证规则**: 长度 1～20 个字符 |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| settings | string | 是 | 卡片配置相关字段，包括 `config` 和 `card_link` 字段。详见 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)<br>**数据验证规则**: 长度 1～100000 个字符 |
| uuid | string | 否 | 幂等 ID，可传入唯一 UUID 确保同一批操作只执行一次<br>**数据验证规则**: 长度 1～64 个字符 |
| sequence | int | 是 | 卡片操作序列号，用于保证多次更新的先后顺序<br>**数据验证规则**: int32 范围内的正整数（1～2147483647）<br>**示例值**: `1` |

### 请求体示例

```json
{
  "settings": "{\"config\":{\"streaming_mode\":true,\"enable_forward\":true,\"update_multi\":true,\"width_mode\":\"fill\",\"enable_forward_interaction\":false},\"card_link\":{\"url\":\"https://open.feishu.cn\",\"android_url\":\"https://open.feishu.cn\",\"ios_url\":\"https://open.feishu.cn\",\"pc_url\":\"https://open.feishu.cn\"}}",
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1
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
| 400 | 10002 | 请求中包含无效的请求参数 | 参数错误 |
| 400 | 200740 | 卡片实体不存在 | 请检查实体 ID 是否正确 |
| 400 | 200750 | 卡片实体已过期 | 有效期为 14 天 |
| 400 | 200770 | UUID 冲突 | 请传入唯一 UUID |
| 400 | 200810 | 卡片正在交互中，无法更新 | 卡片正在进行交互 |
| 400 | 200860 | 卡片内容超限 | 请控制在 30KB 以内 |
| 400 | 300302 | update_multi 属性为 false | 流式更新模式下必须为 true |
| 400 | 200220 | 生成卡片内容失败 | 请检查卡片 JSON 格式 |
| 400 | 300307 | 卡片 DSL 为空 | 卡片 JSON 数据为空 |
| 400 | 300311 | 当前应用无权更新/使用此卡片 | 只有创建卡片实体的应用才能操作 |
| 400 | 300317 | 操作序列号未连续递增 | sequence 值需严格递增 |
| 400 | 300122 | 更新卡片配置失败 | 请检查输入参数 |

## 使用示例

```bash
curl -X PATCH "https://open.feishu.cn/open-apis/cardkit/v1/cards/7355372766134157313/settings" \
  -H "Authorization: Bearer t-7f1bcd13fc57d46bac21793a18e560" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "settings": "{\"config\":{\"streaming_mode\":true}}",
    "sequence": 2
  }'
```

---

*文档来源：飞书开放平台官方文档*
