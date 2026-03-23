# 创建卡片实体

创建卡片实体。

## 使用限制

- 此接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure) 或使用卡片构建工具构建的 [新版本卡片](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-cardkit/cardkit-upgraded-version-card-release-notes)
- 调用此接口时，不支持将卡片设置为独占卡片模式，即不支持将卡片 JSON 数据中的 `update_multi` 属性设置为 `false`
- 卡片实体的有效期为 14 天，即创建卡片实体 14 天后，将无法调用相关接口操作卡片
- 一个卡片实体只能发送一次

## 请求

| 项目 | 说明 |
|------|------|
| HTTP URL | `https://open.feishu.cn/open-apis/cardkit/v1/cards` |
| HTTP 方法 | `POST` |
| 限流 | [1000 次/分钟 & 50 次/秒](https://open.feishu.cn/document/ukTMukTMukTM/uUzN04SN3QjL1cDN) |
| 支持的应用类型 | 自定义应用、商店应用 |
| 必填 scopes | `cardkit:card:write`（创建和更新卡片） |

### 请求头

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Authorization | string | 是 | `tenant_access_token`<br>**值格式**: `"Bearer access_token"`<br>**示例值**: `"Bearer t-7f1bcd13fc57d46bac21793a18e560"` |
| Content-Type | string | 是 | **固定值**: `"application/json; charset=utf-8"` |

### 请求体参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 卡片类型。可选值：<br>- `card_json`: 从卡片 JSON 代码构建的卡片<br>- `template`: 用卡片构建工具构建的卡片模板<br>**示例值**: `"card_json"`<br>**数据验证规则**: 长度 1～50 个字符 |
| data | string | 是 | 卡片数据。必须与 `type` 指定的类型一致：<br>- 如果 `type` 为 `card_json`，则此处应传入卡片 JSON 代码，并确保已转义为字符串。仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)，即必须声明 `schema` 为 `2.0`<br>- 如果 `type` 为 `template`，则此处应传入卡片模板数据，并确保已转义为字符串。仅支持新版本卡片<br>**示例值**: 参考下方请求体示例<br>**数据验证规则**: 长度 1～3000000 个字符 |

### 请求体示例

```json
{
  "type": "card_json",
  "data": "{\"schema\":\"2.0\",\"header\":{\"title\":{\"content\":\"项目进度更新提醒\",\"tag\":\"plain_text\"}},\"config\":{\"streaming_mode\":true,\"summary\":{\"content\":\"\"},\"streaming_config\":{\"print_frequency_ms\":{\"default\":70,\"android\":70,\"ios\":70,\"pc\":70},\"print_step\":{\"default\":1,\"android\":1,\"ios\":1,\"pc\":1},\"print_strategy\":\"fast\"}},\"body\":{\"elements\":[{\"tag\":\"markdown\",\"content\":\"截至今日，项目完成度已达 80%\",\"element_id\":\"markdown_1\"}]}}"
}
```

```json
{
  "type": "template",
  "data": "{\"template_id\":\"AAqIi1B8abcef\",\"template_version_name\":\"1.0.0\",\"template_variable\":{\"open_id\":\"ou_5c6d1637498e704f541095bba3dabcef\"}}"
}
```

## 响应

### 响应体参数

| 参数 | 类型 | 说明 |
|------|------|------|
| code | int | 错误码，非零表示失败 |
| msg | string | 错误描述 |
| data | - | - |
| card_id | string | 卡片实体 ID |

### 响应体示例

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "card_id": "7355372766134157313"
  }
}
```

## 错误码

| HTTP 状态码 | 错误码 | 描述 | 排查建议 |
|-----------|--------|------|---------|
| 400 | 10002 | 请求中包含无效的请求参数 | 参数错误。请根据接口返回的错误信息检查输入参数，并参考文档 |
| 400 | 200860 | 卡片内容超限 | 卡片大小超出限制，建议将卡片大小控制在 30KB 以内 |
| 400 | 300301 | 卡片组件中存在重复的 element_id | 卡片内部组件的 ID（element_id）重复，请检查修改 |
| 400 | 300302 | update_multi 属性为 false | 流式更新模式下，卡片全局属性 update_multi 必须设置为 true |
| 400 | 300303 | 仅支持 schema 2.0 | 此接口仅支持 Schema v2.0 结构，详见 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure) |
| 400 | 200220 | 生成卡片内容失败 | 生成卡片内容失败，请检查卡片 JSON 格式是否有误 |
| 400 | 300305 | 卡片组件数量超过 200 | 超出卡片组件数量限制，卡片 JSON 2.0 结构下单张卡片最多支持 200 个元素或组件 |
| 400 | 300307 | 卡片 DSL 为空 | 卡片 JSON 数据为空，请检查修改 |

## 使用示例

```bash
curl -X POST "https://open.feishu.cn/open-apis/cardkit/v1/cards" \
  -H "Authorization: Bearer t-7f1bcd13fc57d46bac21793a18e560" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "type": "card_json",
    "data": "{\"schema\":\"2.0\",\"header\":{\"title\":{\"content\":\"测试卡片\",\"tag\":\"plain_text\"}},\"body\":{\"elements\":[{\"tag\":\"markdown\",\"content\":\"你好世界\",\"element_id\":\"md_1\"}]}}"
  }'
```

---

*文档来源：飞书开放平台官方文档*
