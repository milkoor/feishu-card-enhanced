# 飞书卡片 API 完整文档

> 下载时间：2026-03-20  
> 来源：飞书开放平台  
> 状态：✅ 已下载

---

## 📡 API 概览

飞书卡片 OpenAPI 提供了完整的卡片和组件操作能力。以下接口仅支持 [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)。

### 基础信息

| 项目 | 值 |
|------|-----|
| **HTTP URL 前缀** | `https://open.feishu.cn/open-apis/cardkit/v1` |
| **支持的应用类型** | 自定义应用、商店应用 |
| **所需权限** | `cardkit:card:write` (创建和更新卡片) |
| **Access Token** | `tenant_access_token` |
| **限流** | 1000 次/分钟 & 50 次/秒 |

---

## 📦 卡片级别 API

### 1. 创建卡片实体

**接口**: `POST /open-apis/cardkit/v1/cards`

**请求头**:
```json
{
  "Authorization": "Bearer t-7f1bcd13fc57d46bac21793a18e560",
  "Content-Type": "application/json; charset=utf-8"
}
```

**请求体**:
```json
{
  "type": "card_json",
  "data": "{\"schema\":\"2.0\",\"header\":{\"title\":{\"content\":\"项目进度更新提醒\",\"tag\":\"plain_text\"}},\"config\":{\"streaming_mode\":true},\"body\":{\"elements\":[{\"tag\":\"markdown\",\"content\":\"截至今日，项目完成度已达 80%\",\"element_id\":\"markdown_1\"}]}}"
}
```

**响应体**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "card_id": "7355372766134157313"
  }
}
```

**使用限制**:
- 仅支持卡片 JSON 2.0 结构
- 不支持设置 `update_multi` 为 `false`
- 卡片实体有效期 14 天
- 一个卡片实体只能发送一次

**常见错误码**:
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 200860 | 卡片内容超出限制 | 保持卡片大小在 30KB 以内 |
| 300301 | element_id 重复 | 检查组件 ID 是否重复 |
| 300305 | 组件数量超过 200 | 确保组件总数不超过 200 |
| 300307 | 卡片 DSL 为空 | 检查卡片 JSON 数据 |

---

### 2. 全量更新卡片实体

**接口**: `PUT /open-apis/cardkit/v1/cards/:card_id`

**路径参数**:
- `card_id`: 卡片实体 ID

**请求体**:
```json
{
  "card": {
    "type": "card_json",
    "data": "{\"schema\":\"2.0\",\"header\":{\"title\":{\"content\":\"标题\",\"tag\":\"plain_text\"}},\"body\":{\"elements\":[{\"tag\":\"markdown\",\"content\":\"内容\"}]}}"
  },
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1712578784
}
```

**响应体**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {}
}
```

**重要说明**:
- 调用接口的应用身份必须与创建目标卡片实体的应用身份一致
- `sequence` 值必须严格递增
- `uuid` 用于幂等性保证

**常见错误码**:
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 200740 | 卡片实体不存在 | 检查实体 ID 是否正确 |
| 200750 | 卡片实体已过期 | 卡片实体有效期 14 天 |
| 200770 | UUID 冲突 | 使用唯一的 UUID |
| 200810 | 卡片正在交互中 | 等待交互完成 |
| 300311 | 无权限更新卡片 | 只有创建卡片的应用才能操作 |
| 300317 | sequence 未递增 | 确保 sequence 严格递增 |

---

## 🧩 组件级别 API

### 1. 添加组件

**接口**: `POST /open-apis/cardkit/v1/cards/:card_id/elements`

**路径参数**:
- `card_id`: 卡片实体 ID

**请求体**:
```json
{
  "type": "insert_before",
  "target_element_id": "elem_63529372",
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "sequence": 1,
  "elements": "[{\"tag\":\"markdown\",\"id\":\"md_1\",\"content\":\"示例文本\"}]"
}
```

**type 可选值**:
- `insert_before`: 在目标组件前插入
- `insert_after`: 在目标组件后插入
- `append`: 添加到卡片或容器组件末尾

**常见错误码**:
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 200510 | 卡片流式更新超时 | 调用更新卡片设置接口设置 streaming_mode 为 true |
| 300315 | 添加组件失败 | 检查输入参数 |

---

### 2. 更新组件

**接口**: `PUT /open-apis/cardkit/v1/cards/:card_id/elements/:element_id`

**路径参数**:
- `card_id`: 卡片实体 ID
- `element_id`: 组件 ID

**请求体**:
```json
{
  "uuid": "a0d69e20-1dd1-458b-k525-dfeca4015204",
  "element": "{\"tag\":\"markdown\",\"id\":\"md_1\",\"content\":\"普通文本\"}",
  "sequence": 1
}
```

**常见错误码**:
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 300121 | 替换组件失败 | 检查输入参数 |
| 300312 | 无法更新 element tag | 组件的 tag 属性不可变 |
| 300313 | 更新组件属性失败 | 检查输入参数 |

---

### 3. 更新组件属性

**接口**: `PATCH /open-apis/cardkit/v1/cards/:card_id/elements/:element_id`

用于更新组件的部分属性，而不是整个组件。

---

### 4. 流式更新文本

**接口**: `PUT /open-apis/cardkit/v1/cards/:card_id/elements/:element_id/content`

用于流式更新文本内容，适用于实时生成文本场景。

---

### 5. 删除组件

**接口**: `DELETE /open-apis/cardkit/v1/cards/:card_id/elements/:element_id`

**常见错误码**:
| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 300314 | 删除组件失败 | 检查输入参数 |

---

## 📊 数据验证规则

### 卡片数据
- **最大大小**: 30KB
- **最大组件数**: 200 个
- **JSON 结构**: 必须是 schema 2.0
- **element_id**: 唯一，字母数字下划线，最多 20 字符

### 请求参数
- **card_id**: 1-20 字符
- **element_id**: 1-20 字符
- **uuid**: 1-64 字符
- **sequence**: int32 正整数 (1~2147483647)
- **data**: 1-3000000 字符

---

## 🔐 权限说明

### 所需权限
所有接口都需要以下权限之一：
- `cardkit:card:write` (创建和更新卡片)

### Access Token
- **类型**: `tenant_access_token`
- **格式**: `Bearer <access_token>`
- **获取方式**: 参考 [如何选择和获取 access token](https://open.feishu.cn/document/uAjLw4CM/ugTN1YjL4UTN24CO1UjN/trouble-shooting/how-to-choose-which-type-of-token-to-use)

---

## ⚠️ 使用限制

1. **JSON 2.0 结构**: 所有接口仅支持卡片 JSON 2.0 结构
2. **共享卡片**: 不支持设置 `update_multi` 为 `false`
3. **应用一致性**: 调用接口的应用必须与创建卡片的应用一致
4. **有效期**: 卡片实体有效期 14 天
5. **组件数量**: 单个卡片最多 200 个组件
6. **卡片大小**: 建议保持在 30KB 以内

---

## 🔄 流式更新模式

### 配置方式
```json
{
  "config": {
    "streaming_mode": true,
    "streaming_config": {
      "print_frequency_ms": {
        "default": 70,
        "android": 70,
        "ios": 70,
        "pc": 70
      },
      "print_step": {
        "default": 1,
        "android": 1,
        "ios": 1,
        "pc": 1
      },
      "print_strategy": "fast"
    }
  }
}
```

### sequence 规则
- 必须是正整数
- 必须严格递增
- 用于保证多次更新的时序性
- 格式：int32 范围内 (1~2147483647)

---

## 📝 最佳实践

### 1. 卡片创建
```json
{
  "type": "card_json",
  "data": "{\"schema\":\"2.0\",\"config\":{\"update_multi\":true},\"header\":{\"title\":{\"tag\":\"plain_text\",\"content\":\"标题\"}},\"body\":{\"elements\":[{\"tag\":\"div\",\"text\":{\"tag\":\"plain_text\",\"content\":\"内容\"}}]}}"
}
```

### 2. 组件更新
```json
{
  "type": "insert_before",
  "target_element_id": "target_id",
  "uuid": "unique-uuid-here",
  "sequence": 123456,
  "elements": "[{\"tag\":\"div\",\"text\":{\"tag\":\"plain_text\",\"content\":\"新组件\"}}]"
}
```

### 3. 错误处理
- 检查 `code` 是否为 0
- 根据错误码采取相应措施
- 对于限流错误，实现指数退避
- 对于 UUID 冲突，生成新的 UUID 重试

---

## 🔗 相关链接

### 核心文档
- [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)
- [组件总览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/component-overview)
- [飞书卡片概览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview)

### API 相关
- [API 资源总览](https://open.feishu.cn/document/cardkit-v1/feishu-card-resource-overview)
- [限流说明](https://open.feishu.cn/document/ukTMukTMukTM/uUzN04SN3QjL1cDN)
- [Access Token 选择](https://open.feishu.cn/document/uAjLw4CM/ugTN1YjL4UTN24CO1UjN/trouble-shooting/how-to-choose-which-type-of-token-to-use)

---

*下载时间：2026-03-20 08:35*
